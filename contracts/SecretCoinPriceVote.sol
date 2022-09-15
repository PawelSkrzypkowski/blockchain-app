pragma solidity ^0.8.0;

contract SecretCoinPriceVote {

    uint32 public betFinalPrice;
    uint public betUTCTime;
    uint public singleBetValue;
    BetTaker[] public betTakers;
    uint public totalBetsValue;
    uint8 totalBets;
    bool public finished;

    event BetStarted(address betOwner, uint betTime);
    event BetFinished(uint32 finalPrice);

    struct BetTaker {
        uint32 betPrice;
        address takerAddress;
        bool valid;
    }

    modifier notRegisteredAndCorrectValue() {
        require(findProperStructObject(msg.sender).valid);
        require(msg.value == singleBetValue);
        require(totalBets < 100);
        _;
    }

    constructor(uint betValue, uint betTime){
        betUTCTime = betTime;
        singleBetValue = betValue;
        emit BetStarted(msg.sender, betTime);
    }

    function isFinished() public view returns (bool) {
        return finished;
    }

    function registerBetTaker(uint32 bet) public payable notRegisteredAndCorrectValue {
        betTakers.push(BetTaker(bet, msg.sender, true));

        totalBets++;
        totalBetsValue += msg.value;
    }

    function completeBet() public payable{
        require(betFinalPrice > 0);
        require(!finished);
        if (totalBets == 0) {
            return;
        } else if(totalBets == 1) {
            (bool sent, bytes memory data) = betTakers[0].takerAddress.call{value: totalBetsValue}("");
            require(sent, "Failed to send Ether");
        } else if (totalBets == 2) {
            completeForTwoPlayers();
        } else {

        }
        emit BetFinished(betFinalPrice);
        finished = true;
    }

    function completeForTwoPlayers() private {
        BetTaker memory firstPlayer = betTakers[0];
        BetTaker memory secondPlayer = betTakers[1];
        uint32 firstPlayerScore = firstPlayer.betPrice - betFinalPrice;
        uint32 secondPlayerScore = secondPlayer.betPrice - betFinalPrice;
        if (firstPlayerScore == secondPlayerScore) {
            (bool sent, bytes memory data) = betTakers[0].takerAddress.call{value: totalBetsValue / 2}("");
            (bool sent2, bytes memory data2) = betTakers[1].takerAddress.call{value: totalBetsValue / 2}("");
            require(sent, "Failed to send Ether");
            require(sent2, "Failed to send Ether");
        } else if(firstPlayerScore > secondPlayerScore) {
            (bool sent, bytes memory data) = betTakers[1].takerAddress.call{value: totalBetsValue}("");
            require(sent, "Failed to send Ether");
        } else {
            (bool sent, bytes memory data) = betTakers[0].takerAddress.call{value: totalBetsValue}("");
            require(sent, "Failed to send Ether");
        }
    }

    function findProperStructObject(address betTakerAddress) private view returns (BetTaker memory betTaker){
        for (uint8 i = 0; i < totalBets; i++) {
            if (betTakers[i].takerAddress == betTakerAddress) {
                betTaker = betTakers[i];
            }
        }
    }

    function quickSort(BetTaker[] memory arr, int left, int right) internal {
        int i = left;
        int j = right;
        if(i==j) return;
        uint pivot = arr[uint(left + (right - left) / 2)].betPrice - betFinalPrice;
        while (i <= j) {
            while (arr[uint(i)].betPrice - betFinalPrice < pivot) i++;
            while (pivot < arr[uint(j)].betPrice - betFinalPrice) j--;
            if (i <= j) {
                (arr[uint(i)], arr[uint(j)]) = (arr[uint(j)], arr[uint(i)]);
                i++;
                j--;
            }
        }
        if (left < j)
            quickSort(arr, left, j);
        if (i < right)
            quickSort(arr, i, right);
    }
}