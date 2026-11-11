'use client'

import { useAccount, useBalance, useReadContracts, useSwitchChain, useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import { STAKING_ADDRESS, STAKING_ABI, STLTC_ADDRESS, STLTC_ABI } from '@/lib/contracts'
import { litVMTestnet } from '@/lib/chains'

export function useStaking() {
  const { address, chainId: walletChainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  // Switch the *connected* wallet to LitVM (wagmi adds the chain if missing)
  const ensureLitVMNetwork = async () => {
    if (walletChainId !== litVMTestnet.id) {
      await switchChainAsync({ chainId: litVMTestnet.id })
    }
  }

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
