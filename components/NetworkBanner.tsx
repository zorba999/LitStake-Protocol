'use client'

import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useAccount, useChainId } from 'wagmi'
import { litVMTestnet } from '@/lib/chains'

async function switchToLitVM() {
  const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
  if (!eth) return
  const hex = `0x${litVMTestnet.id.toString(16)}`
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex }] })
  } catch {
    await eth.request({ method: 'wallet_addEthereumChain', params: [{
      chainId: hex,
      chainName: litVMTestnet.name,
      nativeCurrency: litVMTestnet.nativeCurrency,
      rpcUrls: [litVMTestnet.rpcUrls.default.http[0]],
      blockExplorerUrls: [litVMTestnet.blockExplorers.default.url],
    }]})
  }
}

export function NetworkBanner() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [hide, setHide] = useState(false)

  const wrong = isConnected && chainId !== litVMTestnet.id
  if (!wrong || hide) return null

  return (
    <div className="border-b border-warning/40 bg-warning/10 text-warning">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm font-body">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong className="font-display tracking-wide">Wrong network.</strong>{' '}
            <button onClick={switchToLitVM} className="underline hover:no-underline">
              Switch to LitVM LiteForge (Chain 4441)
            </button>
          </span>
        </div>
        <button onClick={() => setHide(true)} className="rounded p-1 hover:bg-warning/20 flex-shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
