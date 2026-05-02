const steps = [
  { n: '01', t: 'Deposit zkLTC',  d: 'Connect your wallet on LitVM LiteForge and deposit zkLTC into the LitStake vault.' },
  { n: '02', t: 'Receive stLTC',  d: 'Get liquid stLTC tokens at the current exchange rate. Use them across LitVM DeFi.' },
  { n: '03', t: 'Earn & Redeem',  d: 'Yield accrues to the exchange rate. Burn stLTC anytime to redeem zkLTC + rewards.' },
]

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-10 text-center">
        <div className="pill mx-auto">Protocol</div>
        <h2 className="font-display mt-4 text-3xl md:text-4xl font-bold">How LitStake Works</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="glass glass-hover relative rounded-2xl p-6 animate-fade-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className="font-display flex h-12 w-12 items-center justify-center rounded-xl text-sm font-black text-primary-foreground"
              style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--glow-soft)' }}
            >
              {s.n}
            </div>
            <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
            <p className="mt-2 text-muted-foreground font-body">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
