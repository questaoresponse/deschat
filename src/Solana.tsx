import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { getProgram, sendTransaction } from './solana';
import WalletConnection from './WalletConnection';
import { WalletContextProvider } from './WalletContext';

const Solana = () => {
  const { connected, publicKey, wallet } = useWallet();
  const [program, setProgram] = useState(null);

  useEffect(() => {
    if (connected && publicKey) {
      const connection = new Connection('https://api.devnet.solana.com');
      const prog = getProgram(connection, wallet);
      setProgram(prog);
    }
  }, [connected, publicKey, wallet]);

  const handleSendTransaction = async () => {
    if (program) {
      const signature = await sendTransaction(connection, wallet, program);
      console.log('Transação enviada:', signature);
    }
  };

  return (
    <div>
      <WalletConnection />
      {connected && program && (
        <button onClick={handleSendTransaction}>Enviar Transação</button>
      )}
    </div>
  );
};

export default Solana;