// Fixture
// Test deploy with owner equals sender
// Tests txn reverted with message if not enough eth
// Test funds accepted and balance equals receieved funds

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");

describe("FundMe", function () {
  async function deployFixture() {
    // get signers
    const [owner, funder1, funder2] = await ethers.getSigners();
    // get contract
    const FundMe = await ethers.getContractFactory("FundMe");
    // deploy

    const chainId = network.config.chainId;
    console.log("chainId:", chainId)

    const ethUsdPriceFeedAddress =
      networkConfig[chainId]["ethUsdPriceFeedAddress"];

    const fundme = await FundMe.deploy(
      ethUsdPriceFeedAddress
    );
    // wait with deployed
    await fundme.deployed();

    // return contract, owner
    return { fundme, owner, funder1, funder2 };
  }

  it("Sender is the Owner of deployed contract ", async function () {
    const { fundme, owner } = await loadFixture(deployFixture);

    expect(await fundme.owner()).to.equal(owner.address);
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
    const { fundme, owner, funder1 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });
    expect(await fundme.getAllFunders()).to.deep.equal([
      owner.address,
      funder1.address,
    ]);
  });

  it("Funders' contributions are recorded", async function () {
    const { fundme, owner, funder1 } = await loadFixture(deployFixture);

    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder1).fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });
    expect(await fundme.addressToAmount(funder1.address)).to.equal(
      ethAmount.mul(2)
    );
  });

  it("owner can withdraw funds", async function () {
    const { fundme, owner, funder1 } = await loadFixture(deployFixture);

    initialOwnerBalance = await ethers.provider.getBalance(owner.address);
    const ethAmount = ethers.utils.parseEther("0.029");
    await fundme.connect(funder1).fund({ value: ethAmount });
    await fundme.connect(funder1).fund({ value: ethAmount });

    initialContractBalance = await ethers.provider.getBalance(fundme.address);
    expect(initialContractBalance).to.equal(ethAmount.mul(2));

    await fundme.withdraw();

    finalOwnerBalance = await ethers.provider.getBalance(owner.address);
    finalContractBalance = await ethers.provider.getBalance(fundme.address);

    // expect(finalOwnerBalance.add(gasUsed)).to.equal(initialOwnerBalance.add(ethAmount.mul(2)));
    expect(finalContractBalance).to.equal(0);
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

    expect(await fundme.addressToAmount(funder1.address)).to.equal(
      ethZeroAmount
    );
    expect(await fundme.addressToAmount(funder2.address)).to.equal(
      ethZeroAmount
    );
  });
});
