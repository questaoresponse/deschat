import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
    bscTestnet,
    arbitrum,
    base,
    mainnet,
    optimism,
    polygon,
    sepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'RainbowKit demo',
    projectId: '88915c65b9ad254612c4e9c0f528893e',
    chains: [
        bscTestnet,
        mainnet,
        polygon,
        optimism,
        arbitrum,
        base,
        ...(import.meta.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    ssr: true,
});