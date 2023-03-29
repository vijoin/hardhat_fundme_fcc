async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts witth the account: ", deployer.address);

  console.log("Account balance: ", (await deployer.getBalance()).toString());

  const FundMe = await ethers.getContractFactory("FundMe");
  const fundMe = await FundMe.deploy("0x694AA1769357215DE4FAC081bf1f309aDC325306");

  console.log("Contract address: ", fundMe.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
