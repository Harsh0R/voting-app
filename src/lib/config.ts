'use client';
import { http, createStorage, cookieStorage } from 'wagmi';
import { sepolia, bscTestnet, blastSepolia, polygonAmoy } from 'wagmi/chains';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

// Define the project ID
const projectId = 'YOUR_PROJECT_ID';

// Use the Chain type from @rainbow-me/rainbowkit directly
const supportedChains: Chain[] = [
   polygonAmoy,
   sepolia,
   bscTestnet,
   blastSepolia,
];

export const config = getDefaultConfig({
   appName: 'WalletConnection',
   projectId,
   chains: [polygonAmoy,
      sepolia,
      bscTestnet,
      blastSepolia,],
   ssr: true,
   storage: createStorage({
      storage: cookieStorage,
   }),
   transports: supportedChains.reduce((obj, chain) => ({
      ...obj,
      [chain.id]: http(),
   }), {} as Record<number, ReturnType<typeof http>>),
});
