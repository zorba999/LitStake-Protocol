'use client'

import { useReadContracts } from 'wagmi'
import { formatEther } from 'viem'
import { STAKING_ADDRESS, STAKING_ABI, STLTC_ADDRESS, STLTC_ABI } from '@/lib/contracts'

function fmt(val: bigint | undefined, dp = 4): string {
  if (val === undefined) return '—'
  return parseFloat(formatEther(val)).toLocaleString('en-US', { maximumFractionDigits: dp })
}

const stats_config = [
  {
    label: 'Total Staked',
    unit: 'zkLTC',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    label: 'Simulated APY',
    unit: '',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: 'Exchange Rate',
    unit: '',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    label: 'stLTC Supply',
    unit: 'stLTC',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

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

  const rateDisplay = exchangeRate
    ? `1 stLTC = ${parseFloat(formatEther(exchangeRate)).toFixed(6)}`
    : '1 stLTC = 1.000000'

  const values = [
    totalAssets  !== undefined ? `${fmt(totalAssets)} zkLTC`  : '—',
    '5.00%',
    rateDisplay,
    totalSupply  !== undefined ? `${fmt(totalSupply)} stLTC`  : '—',
  ]

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {stats_config.map(({ label, icon }, i) => (
        <div
          key={label}
          className="card p-4 flex items-start gap-3 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="w-8 h-8 rounded-lg bg-litvm-teal/10 border border-litvm-teal/20 flex items-center justify-center text-litvm-teal flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-display tracking-widest text-litvm-teal/50 uppercase mb-0.5">
              {label}
            </p>
            <p className={`text-sm font-display font-semibold truncate ${i === 1 ? 'text-emerald-400' : 'text-litvm-heading'}`}>
              {values[i]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
