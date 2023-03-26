const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Test price feed aggregator", function () {
    async function  deployFixture() {
        // get signers
        const [ owner ] = await ethers.getSigners();
        // get contract
        const PriceConverter = await ethers.getContractFactory("PriceConverter");
        // deploy
        const priceConverter = await PriceConverter.deploy();
        // wait with deployed
        await priceConverter.deployed();

        // return contract, owner
        return { priceConverter, owner }
    };

   
    it("Test Latest Price according to blockNumber 3162520", async function () {
        const { priceConverter } = await loadFixture(deployFixture);

        expect(await priceConverter.getPrice()).to.equal(ethers.utils.parseUnits("1727.18", 18))

    });

    it("Test convertion rate according to blockNumber 3162519", async function () {
        const { priceConverter } = await loadFixture(deployFixture);

        expect(await priceConverter.getConversionRate(1)).to.equal(1727)

    });

});
