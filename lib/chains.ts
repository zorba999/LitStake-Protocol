import { defineChain } from 'viem'

// LiteForge infra migrated to Zeeve (Chain ID & gas token unchanged)
export const LITEFORGE_RPC_URL = 'https://rpc.testnet.liteforge.zeeve.net'
export const EXPLORER_URL = 'https://explorer.testnet.liteforge.zeeve.net'

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
      http: [process.env.NEXT_PUBLIC_RPC_URL || LITEFORGE_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'LiteForge Explorer',
      url: EXPLORER_URL,
    },
  },
  testnet: true,
})
