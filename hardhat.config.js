require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: "https://eth-sepolia.g.alchemy.com/v2/<API KEY>",
        blockNumber: 3162519,
      }
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  }
};
