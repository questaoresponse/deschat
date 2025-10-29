// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyNFT {
    uint256 public tokenCounter;
    address public owner;

    // Evento que será emitido toda vez que mintar
    event Minted(address indexed minter, uint256 newCounter);

    constructor() {
        owner = msg.sender;
        tokenCounter = 0;
    }

    function mint() public {
        tokenCounter++;
        emit Minted(msg.sender, tokenCounter);
    }
}
