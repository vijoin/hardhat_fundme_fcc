// Get funds from users
// Witdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./PriceConverter.sol";

contract FundMe {
    using PriceConverter for uint256;

    address public owner;
    
    uint256 public minimumUsd = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmount;

    constructor() {
        owner = msg.sender;
    }

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?
        require(msg.value.getConversionRate() > minimumUsd, "Didn't send enough!");
        funders.push(msg.sender);
        addressToAmount[msg.sender] += msg.value;
     }

    function getAllFunders() public view returns (address[] memory){
        return funders;
    }
}

// function withdraw() public {}
