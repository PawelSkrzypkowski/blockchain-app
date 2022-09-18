pragma solidity ^0.8.0;
import "./SecretCoinPriceVote.sol";

interface PriceVote {
    function isFinished() external view returns (bool);
}

contract SecretPriceVotingWrapper {
    address[] public votes;
    uint public count;

    function addNewVoting(uint betValue, uint betTime) public {
        SecretCoinPriceVote x = new SecretCoinPriceVote(betValue, betTime);
        votes.push(address(x));
        count++;
    }

    function getAllActiveVotingCount() public view returns (uint) {
        return getAllSpecificVotingCount(false);
    }

    function getActiveVoting(uint id) public view returns (address votingAddress) {
        return getSpecificVoting(id, false);
    }

    function getAllFinishedVotingCount() public view returns (uint) {
        return getAllSpecificVotingCount(true);
    }

    function getFinishedVoting(uint id) public view returns (address votingAddress) {
        return getSpecificVoting(id, true);
    }

    function getAllSpecificVotingCount(bool finished) private view returns (uint) {
        uint currentActiveCount = 0;
        for (uint i=0; i < count; i++) {
            if (finished && PriceVote(votes[i]).isFinished() || !finished && !PriceVote(votes[i]).isFinished()) {
                currentActiveCount++;
            }
        }
        return currentActiveCount;
    }

    function getSpecificVoting(uint id, bool finished) private view returns (address votingAddress) {
        require(id < count);
        uint currentActiveCount = 0;
        for (uint i=0; i < count; i++) {
            if (finished && PriceVote(votes[i]).isFinished() || !finished && !PriceVote(votes[i]).isFinished()) {
                if (id == currentActiveCount) {
                    votingAddress = votes[i];
                    return votingAddress;
                } else {
                    currentActiveCount++;
                }
            }
        }
        return votingAddress;
    }
}
