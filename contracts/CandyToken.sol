// SPDX-License-Identifier: MIT
pragma solidity ^0.6.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract CandyToken is ERC20Mintable {
    constructor() public ERC20Mintable("Candy as Token", "CND") {

    }
}
