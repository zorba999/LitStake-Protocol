'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { litVMTestnet } from '@/lib/chains'

const LITVM_CHAIN_HEX = `0x${litVMTestnet.id.toString(16)}`

async function addAndSwitchToLitVM() {
  const eth = (window as unknown as {
    ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> }
  }).ethereum
  if (!eth) return
  try {
    await eth.request({ method: 'wallet_addEthereumChain', params: [{
      chainId: LITVM_CHAIN_HEX,
      chainName: litVMTestnet.name,
      nativeCurrency: litVMTestnet.nativeCurrency,
      rpcUrls: [litVMTestnet.rpcUrls.default.http[0]],
      blockExplorerUrls: [litVMTestnet.blockExplorers.default.url],
    }]})
  } catch {
    try {
      await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: LITVM_CHAIN_HEX }]})
    } catch { /* ignore */ }
  }
}

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function WalletButton() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted]   = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [switching, setSwitching] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isConnected && chainId !== litVMTestnet.id) {
      setSwitching(true)
      addAndSwitchToLitVM().finally(() => setSwitching(false))
    }
  }, [isConnected, chainId])

  const handleSwitchNetwork = async () => {
    setSwitching(true)
    await addAndSwitchToLitVM()
    setSwitching(false)
  }

  if (!mounted) return <div className="h-9 w-36 rounded-xl bg-litvm-teal/10 animate-pulse" />

  const onCorrectNetwork = chainId === litVMTestnet.id

  if (isConnected && address) {
    return (
      <div className="relative flex items-center gap-2">
        {/* Wrong network pill */}
        {!onCorrectNetwork && (
          <button
            onClick={handleSwitchNetwork}
            disabled={switching}
            className="flex items-center gap-1.5 bg-yellow-400/10 hover:bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-display font-semibold tracking-wide px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
          >
            {switching ? (
              <><svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Switching...</>
            ) : (
              <>⚡ Switch to LitVM</>
            )}
          </button>
        )}

        {/* Address button */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2.5 bg-litvm-teal/8 hover:bg-litvm-teal/15 border border-litvm-teal/25 hover:border-litvm-teal/45 rounded-xl px-3.5 py-2 text-sm transition-all duration-200"
        >
          <span className={`w-2 h-2 rounded-full ${onCorrectNetwork ? 'bg-litvm-teal shadow-[0_0_6px_#64BFD3]' : 'bg-yellow-400'}`} />
          <span className="hidden sm:inline text-xs text-litvm-teal/60 font-sans">
            {onCorrectNetwork ? 'LiteForge' : 'Wrong Network'}
          </span>
          <span className="text-litvm-heading font-display font-semibold">{truncate(address)}</span>
          <svg className="w-3 h-3 text-litvm-teal/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-2 w-52 card-static shadow-2xl py-1 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-litvm-teal/10">
                <p className="text-xs text-litvm-teal/50 font-display tracking-widest uppercase">Connected</p>
                <p className="text-sm font-display font-semibold text-litvm-heading mt-0.5">{truncate(address)}</p>
              </div>
              <a
                href={`https://liteforge.explorer.caldera.xyz/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/60 hover:text-litvm-teal hover:bg-litvm-teal/5 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                View on Explorer
              </a>
              {!onCorrectNetwork && (
                <button
                  onClick={() => { handleSwitchNetwork(); setShowMenu(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-yellow-300 hover:bg-yellow-400/5 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                  Switch to LiteForge
                </button>
              )}
              <div className="teal-divider mx-4 my-1" />
              <button
                onClick={() => { disconnect(); setShowMenu(false) }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      disabled={isPending}
      className="btn-primary px-5 py-2 text-sm font-display font-semibold tracking-wide disabled:opacity-50"
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
          Connecting...
        </span>
      ) : 'Connect Wallet'}
    </button>
  )
}
