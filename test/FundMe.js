// Fixture
// Test deploy with owner equals sender
// Tests txn reverted with message if not enough eth
// Test funds accepted and balance equals receieved funds

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("FundMe", function () {
    async function  deployFixture() {
        // get signers
        const [ owner, funder1 ] = await ethers.getSigners();
        // get contract
        const FundMe = await ethers.getContractFactory("FundMe");
        // deploy
        const fundme = await FundMe.deploy();
        // wait with deployed
        await fundme.deployed();

        // return contract, owner
        return { fundme, owner, funder1 }
    };

    it("Sender is the Owner of deployed contract ", async function () {
        const { fundme, owner } = await loadFixture(deployFixture);

        expect(await fundme.owner()).to.equal(owner.address);
    }
    );

    it("Txn reverted with message if not enough amount funded", async function () {
        const { fundme, funder1 } = await loadFixture(deployFixture);
        const ethAmount = ethers.utils.parseEther("0.018")
        await expect(fundme.connect(funder1).fund({ value: ethAmount })).to.be.revertedWith("Didn't send enough!");

    }
    );

    it("Funds are accepted and contract balance equals received funds", async function () {
        const { fundme, funder1 } = await loadFixture(deployFixture);

        const ethAmount = ethers.utils.parseEther("0.029")
        await fundme.connect(funder1).fund({ value: ethAmount });
        expect(await ethers.provider.getBalance(fundme.address)).to.equal(ethAmount);
    }
    );

    describe("Test price feed aggregator", function () {
     it("Test Latest Price according to blockNumber 3162520", async function () {
        const { fundme } = await loadFixture(deployFixture);

        const ethAmount = ethers.utils.parseEther("1")
        expect(await fundme.getPrice()).to.equal(ethers.utils.parseUnits("1727.18", 18))

     });

     it("Test convertion rate according to blockNumber 3162519", async function () {
        const { fundme } = await loadFixture(deployFixture);

        expect(await fundme.getConversionRate(1)).to.equal(1727)

     });
    });

    
});
