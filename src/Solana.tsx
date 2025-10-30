import React, { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import WalletConnection from './WalletConnection';
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "./contracts/SolNFT/SolNFT.json";
import { Keypair } from "@solana/web3.js";



const Solana = () => {
  const wallet = useWallet();
  const [program, setProgram] = useState<any>(null);
  const counterKeypair = useRef<any>({ publicKey: new PublicKey("64dW6jedujsfev1NcR8UYLaurpKKKfXXEUnoie1VfkrQ") });

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const programID = new PublicKey("8HRWBKnfZdsvmroNqoW786qekg5KSnZ1mVmpcgEYijaZ");

      // Conexão com a Devnet
      const connection = new Connection("https://api.mainnet.solana.com");

      // Provider Anchor usando a wallet conectada
      const provider = new AnchorProvider(connection, wallet as any, {});

      // Cria o programa Anchor no frontend
      const program = new Program(idl as any, programID, provider);
      setProgram(program);
    }
  }, [wallet.connected, wallet.publicKey, wallet]);

  const createKeypair = async () => {
    counterKeypair.current = Keypair.generate();

    await program.methods
      .initialize()
      .accounts({
        counter: counterKeypair.current.publicKey,
        user: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([counterKeypair.current])  // quem assina a criação da conta
      .rpc();

    console.log("Conta Counter criada em:", counterKeypair.current.publicKey.toBase58());
  }

  useEffect(()=>{
    // createKeypair();
  },[program]);


  const write = async () => {
    await program.methods
      .increment()
      .accounts({
        counter: counterKeypair.current.publicKey,  // conta que vai ser atualizada
      })
      .rpc();

    console.log("Contador incrementado!");
  }

  const read = async () => {
    const number = await program.account.counter.fetch(counterKeypair.current.publicKey);
    console.log(number.count.toNumber());
  }

  // const handleSendTransaction = async () => {
  //   if (program && connection.current) {
  //     const signature = await sendTransaction(connection.current, wallet, program);
  //     console.log('Transação enviada:', signature);
  //   }
  // };

  return (
    <div>
      <WalletConnection />
      {wallet.connected && program && <>
        <button onClick={write}>Escrever</button>
        <button onClick={read}>Ler</button>

      </>}
    </div>
  );
};

export default Solana;