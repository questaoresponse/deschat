import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnection = () => {
  const { connected, publicKey } = useWallet();

  return (
    <div>
      {connected ? (
        <p>Conectado como {publicKey?.toBase58()}</p>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  );
};

export default WalletConnection;

