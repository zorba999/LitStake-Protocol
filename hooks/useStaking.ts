'use client'

import { useAccount, useBalance, useReadContracts, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { STAKING_ADDRESS, STAKING_ABI, STLTC_ADDRESS, STLTC_ABI } from '@/lib/contracts'
import { litVMTestnet } from '@/lib/chains'

const LITVM_CHAIN_HEX = `0x${litVMTestnet.id.toString(16)}`

// Force MetaMask to switch to LitVM before any transaction
async function ensureLitVMNetwork() {
  const eth = (window as unknown as {
    ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }
  }).ethereum
  if (!eth) throw new Error('No wallet found')

  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: LITVM_CHAIN_HEX }],
    })
  } catch (err: unknown) {
    // Chain not added yet (error code 4902) → add it first
    const code = (err as { code?: number })?.code
    if (code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: LITVM_CHAIN_HEX,
          chainName: litVMTestnet.name,
          nativeCurrency: litVMTestnet.nativeCurrency,
          rpcUrls: [litVMTestnet.rpcUrls.default.http[0]],
          blockExplorerUrls: [litVMTestnet.blockExplorers.default.url],
        }],
      })
    } else {
      throw err
    }
  }
}

export function useStaking() {
  const { address } = useAccount()

  const { data: nativeBalance } = useBalance({
    address,
    query: { refetchInterval: 6_000 },
  })

  const { data } = useReadContracts({
    contracts: [
      { address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'exchangeRate' },
      { address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'totalAssets' },
      {
        address: STLTC_ADDRESS,
        abi: STLTC_ABI,
        functionName: 'balanceOf',
        args: [address ?? '0x0000000000000000000000000000000000000000'],
      },
    ],
    query: { refetchInterval: 6_000 },
  })

  const exchangeRate  = data?.[0]?.result as bigint | undefined
  const totalAssets   = data?.[1]?.result as bigint | undefined
  const stLTCBalance  = data?.[2]?.result as bigint | undefined
  const zkLTCBalance  = nativeBalance?.value

  const { writeContractAsync } = useWriteContract()

  const stake = async (amount: string): Promise<`0x${string}`> => {
    await ensureLitVMNetwork()
    return writeContractAsync({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'stake',
      value: parseEther(amount),
      chainId: litVMTestnet.id,
    })
  }

  const unstake = async (amount: string): Promise<`0x${string}`> => {
    await ensureLitVMNetwork()
    return writeContractAsync({
      address: STAKING_ADDRESS,
      abi: STAKING_ABI,
      functionName: 'unstake',
      args: [parseEther(amount)],
      chainId: litVMTestnet.id,
    })
  }

  const previewStake = (zkLTCIn: bigint): bigint => zkLTCIn

  const previewUnstake = (stLTCIn: bigint): bigint => {
    if (!exchangeRate) return stLTCIn
    return (stLTCIn * exchangeRate) / BigInt(1e18)
  }

  return {
    zkLTCBalance,
    stLTCBalance,
    exchangeRate,
    totalAssets,
    stake,
    unstake,
    previewStake,
    previewUnstake,
  }
}
