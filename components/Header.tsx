'use client'

import { useAccount, useConnect, useDisconnect, useChainId } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useState, useEffect } from 'react'
import { Wallet, Compass, Droplet, BookOpen } from 'lucide-react'
import { Logo } from './Logo'
import { litVMTestnet } from '@/lib/chains'

const LITVM_HEX = `0x${litVMTestnet.id.toString(16)}`

async function addAndSwitchToLitVM() {
  const eth = (window as unknown as { ethereum?: { request: (a: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum
  if (!eth) return
  try {
    await eth.request({ method: 'wallet_addEthereumChain', params: [{
      chainId: LITVM_HEX,
      chainName: litVMTestnet.name,
      nativeCurrency: litVMTestnet.nativeCurrency,
      rpcUrls: [litVMTestnet.rpcUrls.default.http[0]],
      blockExplorerUrls: [litVMTestnet.blockExplorers.default.url],
    }]})
  } catch {
    try { await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: LITVM_HEX }] }) } catch { /* ignore */ }
  }
}

const truncate = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`

export function Header() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [mounted, setMounted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isConnected && chainId !== litVMTestnet.id) addAndSwitchToLitVM()
  }, [isConnected, chainId])

  const onCorrectNetwork = chainId === litVMTestnet.id

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/60 border-b border-primary/15">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-widest text-foreground">LitStake</div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Protocol</div>
          </div>
          <span className="pill ml-2 hidden sm:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
            Testnet
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { icon: Compass,  label: 'Explorer', href: 'https://liteforge.explorer.caldera.xyz' },
            { icon: Droplet,  label: 'Faucet',   href: 'https://liteforge.hub.caldera.xyz' },
            { icon: BookOpen, label: 'Docs',      href: 'https://docs.litvm.com' },
          ].map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-body font-medium text-muted-foreground transition hover:text-primary hover:bg-primary/5">
              <Icon className="h-4 w-4 transition group-hover:drop-shadow-[0_0_6px_hsl(var(--primary))]" />
              {label}
            </a>
          ))}
        </nav>

        {/* Wallet */}
        {!mounted ? (
          <div className="h-9 w-36 rounded-xl bg-primary/10 animate-pulse" />
        ) : isConnected && address ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/8 hover:bg-primary/15 hover:border-primary/45 px-3.5 py-2 text-sm transition-all"
            >
              <span className={`w-2 h-2 rounded-full ${onCorrectNetwork ? 'bg-success shadow-[0_0_6px_hsl(var(--success))]' : 'bg-warning'}`} />
              <span className="hidden sm:inline text-xs text-muted-foreground font-body">
                {onCorrectNetwork ? 'LiteForge' : 'Wrong Network'}
              </span>
              <span className="font-display font-semibold text-foreground">{truncate(address)}</span>
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl shadow-2xl py-1 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-primary/10">
                    <p className="text-xs text-muted-foreground font-display tracking-widest uppercase">Connected</p>
                    <p className="text-sm font-display font-semibold text-foreground mt-0.5">{truncate(address)}</p>
                  </div>
                  <a href={`https://liteforge.explorer.caldera.xyz/address/${address}`} target="_blank" rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors font-body">
                    View on Explorer ↗
                  </a>
                  <div className="teal-divider mx-4 my-1" />
                  <button onClick={() => { disconnect(); setShowMenu(false) }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors font-body">
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="btn-glow flex items-center gap-2 px-5 py-2 text-sm font-display font-semibold tracking-wide disabled:opacity-50"
          >
            <Wallet className="h-4 w-4" />
            {isPending ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </header>
  )
}
