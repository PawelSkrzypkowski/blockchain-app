/*
let Ballot = artifacts.require("./Ballot.sol");

let ballotInstance;

contract('Ballot Contract', function (accounts) {
   it ('Contract deployment', function () {
       return Ballot.deployed().then(function (instance) {
           ballotInstance = instance;
           assert(ballotInstance !== undefined, 'Ballot contract should be defined');
       })
   });

   it ('valid user registration', function () {
       return ballotInstance.giveRightToVote(accounts[1], { from: accounts[0]}).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Registration is valid');
           return ballotInstance.giveRightToVote(accounts[2], { from: accounts[0]});
       }).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Registration is valid');
           return ballotInstance.giveRightToVote(accounts[3], { from: accounts[0]});
       }).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Registration is valid');
       })
   });

   it ('valid voting', function () {
       return ballotInstance.vote(0, { from: accounts[0]}).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Voting is done');
           return ballotInstance.vote(1, { from: accounts[1]});
       }).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Voting is done');
           return ballotInstance.vote(1, { from: accounts[2]});
       }).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Voting is done');
           return ballotInstance.vote(1, { from: accounts[3]});
       }).then(function (result) {
           assert.equal('0x01', result.receipt.status, 'Voting is done');
       })
   });

   it ('validate winner', function () {
       return ballotInstance.winningProposal.call().then(function (result) {
           assert.equal(1, result.toNumber(), 'Winner is validated correctly');
       })
   });

    it ('should not accept unauthorized registration', function () {
        return ballotInstance.giveRightToVote(accounts[6], { from: accounts[1]})
            .then(function (result) {
                throw ("Condition not implemented in Smart Contract");
            }).catch(function (e) {
                if (e === "Condition not implemented in Smart Contract") {
                    assert(false);
                } else {
                    assert(true);
                }
            })
    });

    it ('should not accept unregistered vote', function () {
        return ballotInstance.vote(1, { from: accounts[6]})
            .then(function (result) {
                throw ("Condition not implemented in Smart Contract");
            }).catch(function (e) {
                if (e === "Condition not implemented in Smart Contract") {
                    assert(false);
                } else {
                    assert(true);
                }
            })
    });
});*/
