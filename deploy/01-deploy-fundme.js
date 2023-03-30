const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");

{
  networkConfig;
}

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy} = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  // const ethUsdPriceFeedAddress =
  //   networkConfig[chainId]["ethUsdPriceFeedAddress"];

  let ethUsdPriceFeedAddress

  if (developmentChains.includes(network.name)) {
    ethUsdPriceFeedAddress = (await deployments.get("MockV3Aggregator")).address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeedAddress"];
  }

  await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    log: true,
  });
};
module.exports.tags = ["FundMe"];
