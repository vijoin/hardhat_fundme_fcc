module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('FundMe', {
      from: deployer,
      args: [
        "0x694AA1769357215DE4FAC081bf1f309aDC325306" // Sepolia ETH / USD
      ],
      log: true,
    });
  };
  module.exports.tags = ['FundMe'];
