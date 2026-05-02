import { defineChain } from 'viem'

export const litVMTestnet = defineChain({
  id: 4441,
  name: 'LitVM LiteForge Testnet',
  nativeCurrency: {
    name: 'zkLTC',
    symbol: 'zkLTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL ?? 'https://rpc.liteforge.litvm.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'LiteForge Explorer',
      url: 'https://liteforge.explorer.caldera.xyz',
    },
  },
  testnet: true,
})
