// SPDX-License-Identifier: MIT
pragma solidity ^0.6.1;

import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";
import "./Crowdsale.sol";
import "./MintedCrowdsale.sol";
import "./KYC.sol";

contract CandyTokenSale is MintedCrowdsale {

    KYC kyc;

    constructor(
        uint256 rate,    // rate in TKNbits
        address payable wallet,
        IERC20 token,
        KYC _kyc
    )
        MintedCrowdsale(rate, wallet, token)
        public
    {
        kyc = _kyc;
    }

    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal view override {
        super._preValidatePurchase(_beneficiary, _weiAmount);
        require(kyc.getKycAC(msg.sender), "KYC Contract has not been approved");
        /**
        uint256 _existingContribution = contributions[_beneficiary];
        uint256 _newContribution = _existingContribution.add(_weiAmount);
        require(_newContribution >= investorMinCap && _newContribution <= investorHardCap);
	    contributions[_beneficiary] = _newContribution;     
        */
  }
}

