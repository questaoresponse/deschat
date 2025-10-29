// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    // 1. VARIÁVEL DE ESTADO: Armazenada permanentemente na blockchain.
    // A palavra-chave "public" cria automaticamente uma função "getter" para ler o valor.
    uint256 public favoriteNumber;

    // 2. FUNÇÃO DE ESCRITA (WRITE): Modifica o estado.
    // Requer uma transação e gasta Gás.
    function store(uint256 _newNumber) public {
        favoriteNumber = _newNumber;
    }

    // 3. FUNÇÃO DE LEITURA (READ): Lê o estado.
    // É uma "view", não modifica nada e, portanto, não gasta Gás para ser chamada.
    // Obs: Esta função é redundante porque `favoriteNumber` já é `public`,
    // mas é útil para fins de aprendizado.
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }
}