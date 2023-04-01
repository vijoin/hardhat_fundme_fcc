// Get funds from users
// Witdraw funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PriceConverter.sol";

contract FundMe is Ownable {
    using PriceConverter for uint256;

    uint256 public constant MINIMUMUSD = 50 * 1e18;

    AggregatorV3Interface private priceFeed;

    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmount;

    constructor(address _priceFeedAddress) {
        priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    function fund() public payable {
        // want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract?
        require(
            msg.value.getConversionRate(priceFeed) > MINIMUMUSD,
            "Didn't send enough!"
        );
        s_funders.push(msg.sender);
        s_addressToAmount[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        address[] memory funders = s_funders;
        for (uint i = 0; i < funders.length; i++) {
            s_addressToAmount[funders[i]] = 0;
        }

        s_funders = new address[](0);
        sendViaCall();
    }

    function getAllFunders() public view returns (address[] memory) {
        return s_funders;
    }

    function sendViaCall() internal onlyOwner {
        (bool sent, ) = payable(msg.sender).call{value: address(this).balance}(
            ""
        );
        require(sent, "Failed to send Ether");
    }

    function getFundedAmountByAddress(
        address _funder
    ) public view returns (uint256) {
        return s_addressToAmount[_funder];
    }
}
