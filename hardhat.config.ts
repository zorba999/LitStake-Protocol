import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    liteforge: {
      url: process.env.LITEFORGE_RPC_URL || '',
      accounts: process.env.PRIVATE_KEY ? [`0x${process.env.PRIVATE_KEY}`] : [],
      chainId: 4441,
    },
  },
}

export default config
