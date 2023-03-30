require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();

const { SEPOLIA_APIKEY, SEPOLIA_PRIVATE_KEY, MUMBAI_APIKEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // hardhat: {
    //   forking: {
    //     url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_APIKEY}`,
    //     blockNumber: 3162519,
    //     chainId: 31337,
    //   },
    // },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_APIKEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${MUMBAI_APIKEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 80001,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};
