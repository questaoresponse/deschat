import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Providers } from './providers';
import Deploy from "./Deploy.tsx";
import { BrowserRouter, Route, Routes } from 'react-router';
import { Link } from 'react-router';
import Solana from './Solana.tsx';
import Listener from './Listener.tsx';
import { WalletContextProvider } from './WalletContext.tsx';

export default function Home() {
  return (
    <WalletContextProvider>
    <Providers>
      <div className="flex w-full justify-center items-center p-20">
        <ConnectButton />
        <BrowserRouter>
          <Link to="/">a</Link>
          <br/>
          <Link to="/solana">solana</Link>
          <br/>
          <Link to="/listener">listener</Link>
          <Routes>
            <Route path="/" element={<Deploy></Deploy>}></Route>
            <Route path="/solana" element={<Solana></Solana>}></Route>
            <Route path="/listener" element={<Listener></Listener>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </Providers>
    </WalletContextProvider>
  );
}