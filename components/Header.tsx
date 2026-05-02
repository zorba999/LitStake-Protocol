'use client'

import { WalletButton } from './WalletButton'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1A2A40]/70 backdrop-blur-md border-b border-litvm-teal/10" />

      <div className="relative max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-xl bg-teal-gradient opacity-80" />
            <div className="absolute inset-0 rounded-xl border border-litvm-teal/40" />
            <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm text-white tracking-wider">
              LS
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-litvm-heading text-lg tracking-wide">
              LitStake
            </span>
            <span className="font-sans text-litvm-teal/70 text-sm font-light hidden sm:inline">
              Protocol
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] font-display tracking-widest text-litvm-teal/60 border border-litvm-teal/20 bg-litvm-teal/5 rounded-full px-2.5 py-0.5 uppercase">
            Testnet
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/40 font-sans">
          {[
            { label: 'Explorer', href: 'https://liteforge.explorer.caldera.xyz' },
            { label: 'Faucet',   href: 'https://liteforge.hub.caldera.xyz' },
            { label: 'Docs',     href: 'https://docs.litvm.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-litvm-teal transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  )
}
