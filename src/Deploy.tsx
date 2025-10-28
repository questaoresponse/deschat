import React, { useState } from "react";
import { useDeployContract, useWalletClient, useWriteContract, useReadContract } from 'wagmi'
import { config } from '../wagmi.tsx';
import MyNFT from "./MyNFT.json"; // ABI

const simpleStorageAbi = MyNFT.abi;
const CONTRACT_ADDRESS = '0x...'; // Endereço do seu contrato SimpleStorage

import { parseEther } from 'viem'; // Exemplo, não usado aqui mas comum

async function DisplayNumber() {
  const { data: number, isLoading, isError } = useReadContract({
    abi: simpleStorageAbi,
    address: CONTRACT_ADDRESS,
    functionName: 'favoriteNumber', // ou 'retrieve'
  });

  if (isLoading) return "Carregando número...";
  if (isError) return "Erro ao buscar o número.";

  return "O número favorito é:" + number?.toString();
}



async function SetNumber() {
    const number = 20;
    const { writeContract, isPending, isSuccess } = useWriteContract();

    const handleStore = async () => {
        if (!number) {
            alert("Por favor, insira um número.");
            return;
        }

        writeContract({
        abi: simpleStorageAbi,
        address: CONTRACT_ADDRESS,
        functionName: 'store',
        args: [BigInt(number)], // Argumentos devem ser passados como um array
        });
    };
  return await handleStore();
//   return (
//     <div>
//       <input
//         type="number"
//         value={number}
//         onChange={(e) => setNumber(e.target.value)}
//         placeholder="Digite um número"
//       />
//       <button onClick={handleStore} disabled={isPending}>
//         {isPending ? 'Salvando...' : 'Salvar Número'}
//       </button>
//       {isSuccess && <div>Número salvo com sucesso!</div>}
//     </div>
//   );
}

export default async function DeployNFTContract() {
   
    const [deploying, setDeploying] = useState(false);
    const [contractAddress, setContractAddress] = useState("");
    const { deployContract } = useDeployContract({config});
    const { data: walletClient } = useWalletClient();
    const useReadContract = useWalletClient();

    const deploy = async () => {
        const bytecode = MyNFT.bytecode.object;
        const result = await deployContract({
        abi: MyNFT.abi, 
        bytecode: `0x${bytecode}`,
        })
        console.log(result);
    };

    console.log(await DisplayNumber());

  return (
    <div style={{ padding: 20 }}>
      <button onClick={deploy} disabled={deploying}>
        {deploying ? "Deployando..." : "Deploy Contrato NFT"}
      </button>
      {contractAddress && (
        <p>
          Endereço do contrato:{" "}
          <a href={`https://mumbai.polygonscan.com/address/${contractAddress}`} target="_blank">
            {contractAddress}
          </a>
        </p>
      )}
    </div>
  );
}
