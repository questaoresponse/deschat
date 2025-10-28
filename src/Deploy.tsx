import React, { useState, useEffect } from "react";
import { useDeployContract, useWalletClient, useWriteContract, useReadContract } from "wagmi";
import { config } from "../wagmi.tsx";
import MyNFT from "./MyNFT.json"; // ABI

const CONTRACT_ADDRESS = "0x..."; // Endereço do seu contrato NFT

export default function DeployNFTContract() {
  const [deploying, setDeploying] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [favoriteNumber, setFavoriteNumber] = useState<number | null>(null);
  const { deployContract } = useDeployContract({ config });
  const { data: walletClient } = useWalletClient();

  const { data: readNumber, isLoading, isError, refetch } = useReadContract({
    abi: MyNFT.abi,
    address: CONTRACT_ADDRESS,
    functionName: "favoriteNumber", // ou 'retrieve'
    watch: true, // atualiza automaticamente
  });

  const { writeContract, isPending, isSuccess } = useWriteContract({
    abi: MyNFT.abi,
    address: CONTRACT_ADDRESS,
    functionName: "store",
  });

  useEffect(() => {
    if (readNumber) setFavoriteNumber(Number(readNumber));
  }, [readNumber]);

  const deploy = async () => {
    setDeploying(true);
    try {
      const bytecode = MyNFT.bytecode.object;
      const result = await deployContract({
        abi: MyNFT.abi,
        bytecode: `0x${bytecode}`,
      });
      console.log("Deploy result:", result);
      setContractAddress(result);
    } catch (err) {
      console.error("Erro ao deployar contrato:", err);
    } finally {
      setDeploying(false);
    }
  };

  const handleStore = async () => {
    const numberToStore = 20;
    try {
      await writeContract({ args: [BigInt(numberToStore)] });
      await refetch();
    } catch (err) {
      console.error("Erro ao salvar número:", err);
    }
  };

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

      <div style={{ marginTop: 20 }}>
        <button onClick={handleStore} disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar Número"}
        </button>
        {isSuccess && <p>Número salvo com sucesso!</p>}
      </div>

      <div style={{ marginTop: 20 }}>
        {isLoading && <p>Carregando número...</p>}
        {isError && <p>Erro ao buscar o número.</p>}
        {favoriteNumber !== null && <p>O número favorito é: {favoriteNumber}</p>}
      </div>
    </div>
  );
}
