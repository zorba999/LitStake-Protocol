'use client'

import { useReadContracts } from 'wagmi'
import { formatEther } from 'viem'
import { Coins, TrendingUp, Repeat, Layers } from 'lucide-react'
import { STAKING_ADDRESS, STAKING_ABI, STLTC_ADDRESS, STLTC_ABI } from '@/lib/contracts'

function fmt(val: bigint | undefined, dp = 6): string {
  if (val === undefined) return '—'
  return parseFloat(formatEther(val)).toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })
}

export function StatsBar() {
  const { data } = useReadContracts({
    contracts: [
      { address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'totalAssets' },
      { address: STAKING_ADDRESS, abi: STAKING_ABI, functionName: 'exchangeRate' },
      { address: STLTC_ADDRESS,   abi: STLTC_ABI,   functionName: 'totalSupply' },
    ],
    query: { refetchInterval: 6_000 },
  })

  const totalAssets  = data?.[0]?.result as bigint | undefined
  const exchangeRate = data?.[1]?.result as bigint | undefined
  const totalSupply  = data?.[2]?.result as bigint | undefined

  const stats = [
    { icon: Coins,     label: 'Total Staked',   value: totalAssets  !== undefined ? fmt(totalAssets)  : '—', unit: 'zkLTC', accent: 'text-foreground' },
    { icon: TrendingUp,label: 'Simulated APY',  value: '5.000000',  unit: '%',     accent: 'text-success' },
    { icon: Repeat,    label: 'Exchange Rate',  value: exchangeRate !== undefined ? parseFloat(formatEther(exchangeRate)).toFixed(6) : '1.000000', unit: 'zkLTC / stLTC', accent: 'text-foreground' },
    { icon: Layers,    label: 'stLTC Supply',   value: totalSupply  !== undefined ? fmt(totalSupply)  : '—', unit: 'stLTC', accent: 'text-foreground' },
  ]

  return (
    <section className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="glass glass-hover rounded-2xl p-5 animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-body">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className={`mt-3 font-mono text-2xl font-semibold ${s.accent}`}>{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground font-body">{s.unit}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
