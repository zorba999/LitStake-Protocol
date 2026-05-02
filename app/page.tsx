import { Header } from '@/components/Header'
import { StatsBar } from '@/components/StatsBar'
import { StakeCard } from '@/components/StakeCard'

export default function Home() {
  return (
    <div className="relative min-h-screen z-10">
      <Header />
      <main className="max-w-xl mx-auto px-4 pt-28 pb-20">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-litvm-teal/8 border border-litvm-teal/20 rounded-full px-4 py-1.5 text-xs font-display tracking-widest text-litvm-teal uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-litvm-teal animate-pulse-slow shadow-[0_0_6px_#64BFD3]" />
            LitVM LiteForge Testnet
          </div>
          <h1 className="text-4xl font-display font-bold mb-3 tracking-wide">
            <span className="text-shimmer">LitStake</span>
            <span className="text-litvm-heading"> Protocol</span>
          </h1>
          <p className="text-litvm-teal/60 text-base font-sans max-w-sm mx-auto leading-relaxed">
            Stake zkLTC, receive stLTC — a liquid yield-bearing token
            you can use across DeFi while earning rewards.
          </p>
        </div>

        <StatsBar />
        <StakeCard />

        {/* How it works */}
        <div className="card p-6 mt-4 animate-fade-in">
          <h3 className="text-[11px] font-display font-semibold text-litvm-teal/50 uppercase tracking-widest mb-4">
            How it works
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', text: 'Stake zkLTC → instantly receive stLTC at current exchange rate' },
              { step: '2', text: 'stLTC value grows as yield accrues in the vault' },
              { step: '3', text: 'Unstake anytime — burn stLTC → receive more zkLTC than you deposited' },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-litvm-teal/10 border border-litvm-teal/25 text-litvm-teal text-xs font-display font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step}
                </span>
                <p className="text-sm text-litvm-teal/60 font-sans leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
