// Fixture
// Test deploy with owner equals sender
// Tests txn reverted with message if not enough eth
// Test funds accepted and balance equals receieved funds

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network, deployment, ether, getNamedAccounts } = require("hardhat");
const { networkConfig } = require("../../helper-hardhat-config");

describe("FundMe", function () {
  async function deployFixture() {
    await deployments.fixture(["all"]);

    const { deployer } = await getNamedAccounts();

    fundme = await ethers.getContract("FundMe", deployer);

    const [, funder1, funder2] = await ethers.getSigners();

    return { fundme, deployer, funder1, funder2 };
  }

  it("Sender is the Owner of deployed contract ", async function () {
    const { fundme, deployer } = await loadFixture(deployFixture);

    expect(await fundme.owner()).to.equal(deployer);
  });

  it("Txn reverted with message if not enough amount funded", async function () {
    const { fundme, funder1 } = await loadFixture(deployFixture);
    const ethAmount = ethers.utils.parseEther("0.018");
    await expect(
      fundme.connect(funder1).fund({ value: ethAmount })
    ).to.be.revertedWith("Didn't send enough!");
  });

  it("Funds are accepted and contract balance equals received funds", async function () {
    const { fundme, funder1 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder1).fund({ value: ethAmount });
    expect(await ethers.provider.getBalance(fundme.address)).to.equal(
      ethAmount
    );
  });
  it("Funders are recorded", async function () {
    const { fundme, deployer, funder1 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });
    expect(await fundme.getAllFunders()).to.deep.equal([
      deployer,
      funder1.address,
    ]);
  });

  it("Funders' contributions are recorded", async function () {
    const { fundme, deployer, funder1 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder1).fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });
    expect(await fundme.getFundedAmountByAddress(funder1.address)).to.equal(
      ethAmount.mul(2)
    );
  });

  it("owner can withdraw funds", async function () {
    const { fundme, deployer, funder1 } = await loadFixture(deployFixture);

    initialOwnerBalance = await ethers.provider.getBalance(deployer);
    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder1).fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });

    const initialContractBalance = await ethers.provider.getBalance(
      fundme.address
    );
    expect(initialContractBalance).to.equal(ethAmount.mul(2));

    const txn = await fundme.withdraw();
    const txn_receipt = await txn.wait();

    const gasCost = txn_receipt.gasUsed.mul(txn_receipt.effectiveGasPrice);

    const finalOwnerBalance = await ethers.provider.getBalance(deployer);
    const finalContractBalance = await ethers.provider.getBalance(
      fundme.address
    );

    expect(finalContractBalance).to.equal(0);
    expect(finalOwnerBalance.add(gasCost)).to.equal(
      initialOwnerBalance.add(initialContractBalance)
    );
  });

  it("only owner can withdraw funds", async function () {
    const { fundme, funder1, funder2 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder2).fund({ value: ethAmount });
    await fundme.connect(funder2).fund({ value: ethAmount });

    await expect(fundme.connect(funder1).withdraw()).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("registry of funding accounts and amounts must be reset after withdraw", async function () {
    const { fundme, funder1, funder2 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    const ethZeroAmount = ethers.utils.parseEther("0");
    await fundme.connect(funder1).fund({ value: ethAmount });
    await fundme.connect(funder2).fund({ value: ethAmount });
    await fundme.withdraw();

    expect(await fundme.getFundedAmountByAddress(funder1.address)).to.equal(
      ethZeroAmount
    );
    expect(await fundme.getFundedAmountByAddress(funder2.address)).to.equal(
      ethZeroAmount
    );
  });

  // it("Ethers are sent via call function", async function() {
  //   const { fundme, funder1 } = await loadFixture(deployFixture);

  //   const ethAmount = ethers.utils.parseEther("0.029");
  //   await fundme.connect(funder1).sendViaCall();

  // });
  it("Calling a non-exisiting function will capture funds anyway");
  it("Sending funds without calling anything will capture them anyway");
});
