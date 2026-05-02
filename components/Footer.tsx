import { GitBranch, Compass, Droplet } from 'lucide-react'

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
        </div>
      </div>
    </footer>
  )
}
