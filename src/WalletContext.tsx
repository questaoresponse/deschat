import React, { createContext, useContext, useMemo } from 'react';
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

const WalletContext = createContext(null);

export const useSolana = () => useContext(WalletContext);

export const WalletContextProvider = ({ children } : {children: any}) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
    //   new SlopeWalletAdapter(),
    //   new SolletWalletAdapter(),
      new SolflareWalletAdapter(),
    //   new BackpackWalletAdapter(),
    ],
    []
  );

  return (
        <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
                <WalletContext.Provider value={{}}>
                {children}
                </WalletContext.Provider>
            </WalletModalProvider>
        </WalletProvider>
        </ConnectionProvider>
  );
};

