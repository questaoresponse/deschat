import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Providers } from './providers';
import Deploy from "./Deploy.tsx";

export default function Home() {
  return (
    <Providers>
      <div className="flex w-full justify-center items-center p-20">
        <ConnectButton />
        <Deploy></Deploy>
      </div>
    </Providers>
  );
}