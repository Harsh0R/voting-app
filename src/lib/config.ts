'use client';
import { http, createStorage, cookieStorage } from 'wagmi';
import { sepolia, bscTestnet, blastSepolia, polygonAmoy } from 'wagmi/chains';
import { Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';

const projectId = 'YOUR_PROJECT_ID';

// Define the type of the supported chains array explicitly
const supportedChains: Chain[] = [polygonAmoy, sepolia, bscTestnet, blastSepolia];

export const config = getDefaultConfig({
   appName: 'WalletConnection',
   projectId,
   chains: supportedChains, // No need for 'as any' here
   ssr: true,
   storage: createStorage({
      storage: cookieStorage,
   }),
   transports: supportedChains.reduce((obj, chain) => ({
      ...obj,
      [chain.id]: http(),
   }), {} as Record<number, ReturnType<typeof http>>), // Explicitly type the object created by reduce
});
