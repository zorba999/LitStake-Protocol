require('@nomicfoundation/hardhat-toolbox')
require('dotenv').config({ path: '.env.local' })

/** @type {import('hardhat/config').HardhatUserConfig} */
module.exports = {
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
