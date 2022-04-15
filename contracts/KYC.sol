pragma solidity ^0.6.1;

import "@openzeppelin/contracts/ownership/Ownable.sol";


contract KYC is Ownable {
    mapping(address => bool) access;

    function setKycCompleted(address _addr) public onlyOwner {
        access[_addr] = true;
    }

    function setKycRejected(address _addr) public onlyOwner {
        access[_addr] = false;
    }

    /**
     * @dev return the access control of a customer
     * @param _addr Address of the customer
     */
    function getKycAC(address _addr) public view returns(bool) {
        return access[_addr];
    }
}