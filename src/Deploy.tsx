import React, { useState, useEffect } from "react";
import {
  useDeployContract,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { config } from "../wagmi.tsx";
import MyNFT from "./MyNFT.json"; // ABI e Bytecode

const CONTRACT_ADDRESS = "0x..."; // Endereço do contrato pré-existente (se houver)

export default function DeployNFTContract() {
  const [favoriteNumber, setFavoriteNumber] = useState<number | null>(null);
  const [numberToStore, setNumberToStore] = useState(20);

  // 1. Hook para ENVIAR a transação de deploy
  // A função para enviar a transação é desestruturada como 'deployContract' (o nome do retorno do hook)
  const {
    data: deployHash,
    writeContract: deployContractFn, // <--- Renomeando para evitar conflito com o nome do hook e ser mais claro
    isPending: isDeployPending,
    isSuccess: isDeploySent,
    error: deployError,
  } = useDeployContract();
  
  // 2. Hook para AGUARDAR a confirmação do deploy e obter o endereço
  const {
    data: deployReceipt,
    isLoading: isReceiptLoading,
    isSuccess: isDeploySuccess,
  } = useWaitForTransactionReceipt({
    hash: deployHash,
  });

  // 3. Hook para LEITURA (Read) do número
  const currentContractAddress = deployReceipt?.contractAddress || CONTRACT_ADDRESS;
  
  const {
    data: readNumber,
    isLoading: isReadLoading,
    isError: isReadError,
    refetch: refetchNumber,
  } = useReadContract({
    abi: MyNFT.abi,
    address: currentContractAddress, 
    functionName: "favoriteNumber", 
    enabled: currentContractAddress !== "0x...", 
    watch: true, 
  });

  // 4. Hook para ESCRITA (Write) do número
  // A função de envio da transação é desestruturada como 'writeContract'
  const { writeContract, isPending: isStorePending, isSuccess: isStoreSuccess } = useWriteContract();

  // Efeito para atualizar o estado local quando a leitura é concluída
  useEffect(() => {
    if (readNumber) setFavoriteNumber(Number(readNumber));
  }, [readNumber]);

  // Função para ENVIAR a transação de deploy
  const handleDeploy = () => {
    try {
      const bytecode = MyNFT.bytecode.object;
      
      // Chama a função RENOMEADA 'deployContractFn'
      deployContractFn({
        abi: MyNFT.abi,
        bytecode: `0x${bytecode}`,
      });
    } catch (err) {
      console.error("Erro ao preparar transação de deploy:", err);
    }
  };

  // Função para ENVIAR a transação de escrita (store)
  const handleStore = () => {
    if (currentContractAddress === "0x...") {
      alert("Por favor, faça o deploy do contrato ou defina um endereço válido.");
      return;
    }

    try {
      // Chama a função 'writeContract'
      writeContract({
        abi: MyNFT.abi,
        address: currentContractAddress,
        functionName: "store",
        args: [BigInt(numberToStore)],
      });
    } catch (err) {
      console.error("Erro ao salvar número:", err);
    }
  };

  // Status de Deploy
  const deployStatusText = isDeployPending ? "Aguardando confirmação na carteira..." :
                           isDeploySent && isReceiptLoading ? `Transação enviada: ${deployHash.slice(0, 6)}... Aguardando mineração...` :
                           isDeploySuccess ? `Deploy concluído! Endereço: ${currentContractAddress.slice(0, 6)}...` :
                           deployError ? `Erro no Deploy: ${deployError.shortMessage || deployError.message}` :
                           "Deploy Contrato NFT";
  
  return (
    <div style={{ padding: 20 }}>
      <h2>Deploy e Interação com Contrato</h2>
      
      {/* Seção de Deploy */}
      <button onClick={handleDeploy} disabled={isDeployPending || isReceiptLoading || isDeploySuccess}>
        {deployStatusText}
      </button>

      {currentContractAddress !== "0x..." && (
        <p>
          Endereço do contrato:{" "}
          <a href={`https://mumbai.polygonscan.com/address/${currentContractAddress}`} target="_blank" rel="noopener noreferrer">
            {currentContractAddress}
          </a>
        </p>
      )}

      {/* Seção de Escrita */}
      <hr style={{ margin: '20px 0' }} />
      <div>
        <h3>Salvar Número</h3>
        <input 
            type="number" 
            value={numberToStore} 
            onChange={(e) => setNumberToStore(Number(e.target.value))} 
            style={{ marginRight: 10, padding: 5 }}
            min="0"
        />
        <button onClick={handleStore} disabled={isStorePending || currentContractAddress === "0x..."}>
          {isStorePending ? "Salvando..." : "Salvar Número"}
        </button>
        {isStoreSuccess && <p style={{ color: 'green' }}>Transação enviada com sucesso!</p>}
      </div>

      {/* Seção de Leitura */}
      <hr style={{ margin: '20px 0' }} />
      <div>
        <h3>Leitura do Contrato</h3>
        {isReadLoading && <p>Carregando número...</p>}
        {isReadError && <p style={{ color: 'red' }}>Erro ao buscar o número.</p>}
        {favoriteNumber !== null && <p>O **número favorito** é: <strong>{favoriteNumber}</strong></p>}
      </div>
    </div>
  );
}