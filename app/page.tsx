import { AnimatedBg }    from '@/components/AnimatedBg'
import { NetworkBanner } from '@/components/NetworkBanner'
import { Header }        from '@/components/Header'
import { Hero }          from '@/components/Hero'
import { StatsBar }      from '@/components/StatsBar'
import { StakeCard }     from '@/components/StakeCard'
import { HowItWorks }    from '@/components/HowItWorks'
import { Footer }        from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <AnimatedBg />
      <NetworkBanner />
      <Header />

      <main>
        <Hero />
        <StatsBar />

        <section className="container mx-auto grid gap-8 px-4 py-14 lg:grid-cols-[1.1fr_1fr]">
          {/* Left panel */}
          <div className="glass rounded-3xl p-8 animate-fade-up">
            <div className="pill">Liquid Staking</div>
            <h2 className="font-display mt-4 text-3xl md:text-4xl font-bold leading-tight">
              Capital efficient.<br />Self-custodial. Composable.
            </h2>
            <p className="mt-4 max-w-md text-muted-foreground font-body">
              stLTC is a yield-bearing receipt token. Trade it, lend it, or use it as collateral
              while your zkLTC keeps earning a simulated{' '}
              <span className="text-success font-semibold">5.00% APY</span> on the LiteForge testnet.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-center">
              {[
                ['Testnet', 'LiteForge'],
                ['Chain ID', '4441'],
                ['Block time', '~0.4s'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="font-mono text-lg text-primary">{v}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-body">{k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stake card */}
          <StakeCard />
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  )
}
