const SecretPriceVotingWrapper = artifacts.require("SecretPriceVotingWrapper");

module.exports = function (deployer) {
  deployer.deploy(SecretPriceVotingWrapper);
};
