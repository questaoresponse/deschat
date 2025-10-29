import React, { useEffect, useState } from "react";
import { useWatchContractEvent, useAccount, useWriteContract, useReadContract } from "wagmi";
import MyNFT from "./contracts/EventNFT/EventNFT.json"; // ABI e bytecode juntos

const CONTRACT_ADDRESS = "0xf9d039ffc0fac1adb1c6d582256c2a5c2aa91008";

export default function Listener() {
//   const { data: signer } = useSigner();
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [counter, setCounter] = useState(0);

//   const contract = useContract({
//     address: CONTRACT_ADDRESS,
//     abi: MyNFT.abi,
//     signerOrProvider: signer,
//   });

  // Ouvir evento Minted
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: MyNFT.abi,
    eventName: "Minted",
    onLogs(log) {
      console.log("Evento recebido:", log);
      console.log(log[0].args.newCounter!.toNumber());
      setCounter(log[0].args.newCounter!.toNumber());
    },
  });

  const handleMint = async () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: MyNFT.abi,
      functionName: 'mint',
    })
    console.log("Mint enviado!");
  };

    const {
    data: readNumber,
    } = useReadContract({
    abi: MyNFT.abi,
    address: CONTRACT_ADDRESS,
    functionName: "tokenCounter", // certifique-se de que existe no contrato
    });

  useEffect(()=>{
    setCounter(readNumber);
  },[readNumber]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Mint com Evento</h1>
      <p>Token Counter: {counter}</p>
      <button onClick={handleMint}>Mint</button>
    </div>
  );
}
