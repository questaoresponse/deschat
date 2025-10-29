import React, { useState, useEffect } from "react";
import {
  useDeployContract,
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import MyNFT from "./contracts/EventNFT/EventNFT.json"; // ABI e bytecode juntos


const DEFAULT_CONTRACT_ADDRESS = "0xf9d039ffc0fac1adb1c6d582256c2a5c2aa91008";
// const DEFAULT_CONTRACT_ADDRESS = "0x59ce48265ebdeea87c54a41c3882a0bfdaab5c49";

export default function DeployNFTContract() {
  const [favoriteNumber, setFavoriteNumber] = useState<number | null>(null);
  const [numberToStore, setNumberToStore] = useState(20);

  // ---- DEPLOY ----
  const {
    deployContractAsync,
    data: deployHash,
    isPending: isDeployPending,
    isError: isDeployError,
    error: deployError,
  } = useDeployContract();

  const {
    data: deployReceipt,
    isLoading: isReceiptLoading,
    isSuccess: isDeploySuccess,
  } = useWaitForTransactionReceipt({
    hash: deployHash,
  });

  const currentContractAddress =
    deployReceipt?.contractAddress || DEFAULT_CONTRACT_ADDRESS;

  // ---- READ ----
  const {
    data: readNumber,
    isLoading: isReadLoading,
    isError: isReadError,
    refetch: refetchNumber,
  } = useReadContract({
    abi: MyNFT.abi,
    address: currentContractAddress,
    functionName: "tokenCounter", // certifique-se de que existe no contrato
  });

  // ---- WRITE ----
  const {
    writeContractAsync,
    isPending: isStorePending,
    isSuccess: isStoreSuccess,
    error: storeError,
  } = useWriteContract();

  // Atualiza estado ao ler valor
  useEffect(() => {
    if (readNumber !== undefined) setFavoriteNumber(Number(readNumber));
  }, [readNumber]);

  // Deploya o contrato
  const handleDeploy = async () => {
    try {
      const bytecode = MyNFT.bytecode.object;
      const txHash = await deployContractAsync({
        abi: MyNFT.abi,
        bytecode: `0x${bytecode}`,
      });
      console.log("Deploy enviado:", txHash);
    } catch (err) {
      console.error("Erro ao fazer deploy:", err);
    }
  };

  // Escreve um número no contrato
  const handleStore = async () => {
    if (!currentContractAddress) return alert("Endereço inválido.");
    try {
      const tx = await writeContractAsync({
        abi: MyNFT.abi,
        address: currentContractAddress,
        functionName: "mint", // certifique-se de que existe no contrato
      });
      console.log("Transação enviada:", tx);
    } catch (err) {
      console.error("Erro ao salvar número:", err);
    }
  };

  useEffect(()=>{
    setInterval(refetchNumber, 500);
  },[]);

  // Status do deploy
  const deployStatusText = isDeployPending
    ? "Aguardando confirmação na carteira..."
    : isReceiptLoading
    ? `Transação enviada: ${deployHash?.slice(0, 6)}... aguardando mineração...`
    : isDeploySuccess
    ? `Deploy concluído! Endereço: ${currentContractAddress.slice(0, 6)}...`
    : isDeployError
    ? `Erro no deploy: ${deployError?.shortMessage || deployError?.message}`
    : "Deploy Contrato NFT";

  return (
    <div style={{ padding: 20 }}>
      <h2>Deploy e Interação com Contrato</h2>

      {/* Deploy */}
      <button
        onClick={handleDeploy}
        disabled={isDeployPending || isReceiptLoading || isDeploySuccess}
      >
        {deployStatusText}
      </button>

      {currentContractAddress && (
        <p>
          Endereço do contrato:{" "}
          <a
            href={`https://amoy.polygonscan.com/address/${currentContractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {currentContractAddress}
          </a>
        </p>
      )}

      {/* Escrita */}
      <hr style={{ margin: "20px 0" }} />
      <div>
        <h3>Salvar Número</h3>
        <input
          type="number"
          value={numberToStore}
          onChange={(e) => setNumberToStore(Number(e.target.value))}
          style={{ marginRight: 10, padding: 5 }}
          min="0"
        />
        <button
          onClick={handleStore}
          disabled={isStorePending || !currentContractAddress}
        >
          {isStorePending ? "Salvando..." : "Salvar Número"}
        </button>
        {isStoreSuccess && (
          <p style={{ color: "green" }}>Transação enviada com sucesso!</p>
        )}
        {storeError && (
          <p style={{ color: "red" }}>Erro: {storeError.message}</p>
        )}
      </div>

      {/* Leitura */}
      <hr style={{ margin: "20px 0" }} />
      <div>
        <h3>Leitura do Contrato</h3>
        {isReadLoading && <p>Carregando número...</p>}
        {isReadError && <p style={{ color: "red" }}>Erro ao buscar número.</p>}
        {favoriteNumber !== null && (
          <p>
            O número favorito é: <strong>{favoriteNumber}</strong>
          </p>
        )}
        <button onClick={() => refetchNumber()}>Atualizar</button>
      </div>
    </div>
  );
}
