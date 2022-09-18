let SecretPriceVotingWrapper = artifacts.require("./SecretPriceVotingWrapper.sol");

let secretPriceVotingWrapperInstance;

contract('Ballot Contract', function (accounts) {
    it ('Contract deployment', function () {
        return SecretPriceVotingWrapper.deployed().then(function (instance) {
            secretPriceVotingWrapperInstance = instance;
            assert(secretPriceVotingWrapperInstance !== undefined, 'Ballot contract should be defined');
        })
    });

    it ('add voting', function () {
        return secretPriceVotingWrapperInstance.addNewVoting(0.2 * 10 && 18, 1663524454847, { from: accounts[0]})
            .then(function (result) {
                assert.equal('0x01', result.receipt.status, 'Registration is valid');
        })
    });

    it("should succeed", async function() {
        // wrap what you want to debug with `debug()`:
        await debug( secretPriceVotingWrapperInstance.getActiveVoting(0, { from: accounts[0] }) );
    });
});