// Contract addresses — set these after running: npm run deploy:testnet
export const STAKING_ADDRESS = (
  process.env.NEXT_PUBLIC_STAKING_ADDRESS ?? '0x0000000000000000000000000000000000000000'
) as `0x${string}`

export const STLTC_ADDRESS = (
  process.env.NEXT_PUBLIC_STLTC_ADDRESS ?? '0x0000000000000000000000000000000000000000'
) as `0x${string}`

export const STAKING_ABI = [
  {
    name: 'stake',
    type: 'function',
    stateMutability: 'payable',
    inputs: [],
    outputs: [],
  },
  {
    name: 'unstake',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'stLTCAmount', type: 'uint256' }],
    outputs: [],
  },
  {
    name: 'exchangeRate',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalAssets',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'previewStake',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'zkLTCAmount', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'previewUnstake',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'stLTCAmount', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'SIMULATED_APY_BPS',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint16' }],
  },
  {
    name: 'stLTC',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'Staked',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'zkLTCAmount', type: 'uint256', indexed: false },
      { name: 'stLTCMinted', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'Unstaked',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'stLTCBurned', type: 'uint256', indexed: false },
      { name: 'zkLTCReturned', type: 'uint256', indexed: false },
    ],
  },
] as const

export const STLTC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'totalSupply',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'symbol',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
  },
] as const
