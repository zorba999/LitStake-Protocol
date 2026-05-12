import { GitBranch, Compass, Droplet } from 'lucide-react'

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-primary/15 mt-10">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div
            className="grid h-8 w-8 place-items-center rounded-lg font-display text-xs font-black text-primary-foreground"
            style={{ background: 'var(--gradient-primary)' }}
          >
            LS
          </div>
          <span className="text-sm text-muted-foreground font-body">
            © 2026 LitStake Protocol · LitVM LiteForge Testnet
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm text-muted-foreground font-body">
          <a href="https://liteforge.explorer.caldera.xyz" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Compass className="h-4 w-4" /> Explorer
          </a>
          <a href="https://liteforge.hub.caldera.xyz" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <Droplet className="h-4 w-4" /> Faucet
          </a>
          <a href="https://github.com/zorba999/LitStake-Protocol" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <GitBranch className="h-4 w-4" /> GitHub
          </a>
          <a href="https://x.com/LitStake" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <XIcon className="h-4 w-4" /> LitStake
          </a>
          <a href="https://x.com/OHzorba" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <XIcon className="h-4 w-4" /> Founder
          </a>
        </div>
      </div>
    </footer>
  )
}
