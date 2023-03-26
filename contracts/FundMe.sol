// Get funds from users
// Witdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConverter.sol";

contract FundMe is Ownable {
    using PriceConverter for uint256;

    uint256 public minimumUsd = 50 * 1e18;

    address[] public funders;
    mapping(address => uint256) public addressToAmount;

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?
        require(
            msg.value.getConversionRate() > minimumUsd,
            "Didn't send enough!"
        );
        funders.push(msg.sender);
        addressToAmount[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint i = 0; i < funders.length; i++){
            addressToAmount[funders[i]] = 0;
        }

        funders = new address[](0);
        sendViaCall(payable(owner()), address(this).balance);
    }

    function getAllFunders() public view returns (address[] memory) {
        return funders;
    }

    function sendViaCall(address payable _to, uint256 _value) public payable {
        (bool sent, ) = _to.call{value: _value}("");
        require(sent, "Failed to send Ether");
    }
}

// function withdraw() public {}
