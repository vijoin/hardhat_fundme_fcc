// Get funds from users
// Witdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    address public owner;
    AggregatorV3Interface internal priceFeed;
    uint256 public minimumUsd = 50 * 1e18;

    constructor() {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306 // ETH / USD
        );
    }

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?
        require(getConversionRate(msg.value) > minimumUsd, "Didn't send enough!");
    }

    function getPrice() public view returns (uint256) {
        (,int price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(uint256 ethAmount) public view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;

        return ethAmountInUsd;
    }
}

// function withdraw() public {}
