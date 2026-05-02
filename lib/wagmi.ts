import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { litVMTestnet } from './chains'

export const wagmiConfig = createConfig({
  chains: [litVMTestnet],
  connectors: [injected()],
  transports: {
    [litVMTestnet.id]: http(),
  },
  ssr: true,
})
