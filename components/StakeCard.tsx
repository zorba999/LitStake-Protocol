'use client'

import { useState, useEffect } from 'react'
import { useStaking } from '@/hooks/useStaking'
import { useAccount, useBalance, useChainId, useSwitchChain } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { litVMTestnet } from '@/lib/chains'

type Tab = 'stake' | 'unstake'

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function StakeCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const [tab, setTab] = useState<Tab>('stake')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { zkLTCBalance, stLTCBalance, exchangeRate, previewStake, previewUnstake, stake, unstake } = useStaking()

  const wrongNetwork = isConnected && chainId !== litVMTestnet.id

  useEffect(() => {
    setAmount('')
    setTxHash(null)
    setError(null)
  }, [tab])

  const maxBalance = tab === 'stake' ? zkLTCBalance : stLTCBalance
  const maxFormatted = maxBalance !== undefined ? formatEther(maxBalance) : '0'

  const preview = (() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return null
    try {
      const parsed = parseEther(amount)
      return tab === 'stake' ? previewStake(parsed) : previewUnstake(parsed)
    } catch {
      return null
    }
  })()

  const handleMax = () => {
    if (maxBalance !== undefined) {
      const f = parseFloat(formatEther(maxBalance))
      const val = tab === 'stake' ? Math.max(0, f - 0.001) : f
      setAmount(val > 0 ? val.toString() : '0')
    }
  }

  const handleSubmit = async () => {
    setError(null)
    setTxHash(null)
    if (!amount || parseFloat(amount) <= 0) { setError('Enter an amount'); return }
    setLoading(true)
    try {
      const hash = tab === 'stake' ? await stake(amount) : await unstake(amount)
      setTxHash(hash)
      setAmount('')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('User rejected') || msg.includes('user rejected')) {
        setError('Transaction rejected')
      } else {
        setError(msg.slice(0, 120))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 animate-fade-in">
      {/* Tabs */}
      <div className="flex bg-litvm-navy/60 rounded-xl p-1 mb-6 border border-litvm-teal/10">
        {(['stake', 'unstake'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-display font-semibold capitalize tracking-wide transition-all duration-200 ${
              tab === t
                ? 'bg-teal-gradient text-white shadow-lg shadow-litvm-teal/20'
                : 'text-litvm-teal/50 hover:text-litvm-teal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Wrong network banner */}
      {wrongNetwork && (
        <div className="mb-4 p-3 rounded-xl bg-yellow-400/8 border border-yellow-400/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-yellow-300 text-sm font-display">Wrong network</p>
          </div>
          <button
            onClick={() => switchChain({ chainId: litVMTestnet.id })}
            className="text-xs text-yellow-300 hover:text-white font-display font-semibold underline transition-colors"
          >
            Switch to LiteForge
          </button>
        </div>
      )}

      {/* Input */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-display tracking-widest text-litvm-teal/50 uppercase">
            {tab === 'stake' ? 'Amount to stake' : 'stLTC to burn'}
          </span>
          <span className="text-xs text-litvm-teal/40 font-sans">
            Balance:{' '}
            <button
              onClick={handleMax}
              className="text-litvm-teal hover:text-litvm-heading font-semibold transition-colors"
            >
              {parseFloat(maxFormatted).toFixed(6)}{' '}
              {tab === 'stake' ? 'zkLTC' : 'stLTC'}
            </button>
          </span>
        </div>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="input-field w-full px-4 py-4 pr-28"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={handleMax}
              className="text-xs text-litvm-teal font-display font-bold bg-litvm-teal/10 hover:bg-litvm-teal/20 border border-litvm-teal/20 px-2.5 py-1 rounded-lg transition-all"
            >
              MAX
            </button>
            <span className="text-sm font-display font-semibold text-litvm-heading/70">
              {tab === 'stake' ? 'zkLTC' : 'stLTC'}
            </span>
          </div>
        </div>
      </div>

      {/* Preview */}
      {preview !== null && parseFloat(amount) > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-litvm-teal/5 border border-litvm-teal/12 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-litvm-teal/50 font-sans">You will receive</span>
            <span className="text-litvm-heading font-display font-semibold">
              {parseFloat(formatEther(preview)).toFixed(6)}{' '}
              {tab === 'stake' ? 'stLTC' : 'zkLTC'}
            </span>
          </div>
          <div className="teal-divider" />
          <div className="flex justify-between text-sm">
            <span className="text-litvm-teal/50 font-sans">Exchange rate</span>
            <span className="text-litvm-heading/70 font-sans">
              1 stLTC ={' '}
              {exchangeRate ? parseFloat(formatEther(exchangeRate)).toFixed(6) : '1.000000'}{' '}
              zkLTC
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/8 border border-red-500/20">
          <p className="text-red-400 text-sm font-sans">{error}</p>
        </div>
      )}

      {/* Success */}
      {txHash && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-400/8 border border-emerald-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-emerald-400 text-sm font-display font-semibold">Transaction sent!</p>
          </div>
          <a
            href={`https://liteforge.explorer.caldera.xyz/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-litvm-teal hover:text-litvm-heading font-display font-semibold underline transition-colors"
          >
            {shortenHash(txHash)} ↗
          </a>
        </div>
      )}

      {/* Submit button */}
      {!isConnected ? (
        <div className="p-4 rounded-xl bg-litvm-teal/5 border border-litvm-teal/15 text-center">
          <p className="text-litvm-teal/60 text-sm font-display tracking-wide">
            Connect your wallet to start staking
          </p>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={loading || wrongNetwork || !amount || parseFloat(amount) <= 0}
          className="btn-primary w-full py-4 text-base font-display font-bold tracking-wide"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Processing...
            </span>
          ) : (
            tab === 'stake' ? '⚡ Stake zkLTC' : '↩ Unstake stLTC'
          )}
        </button>
      )}

      {/* My position */}
      {isConnected && stLTCBalance !== undefined && stLTCBalance > 0n && (
        <div className="mt-5 pt-4 border-t border-litvm-teal/10">
          <p className="text-[11px] font-display tracking-widest text-litvm-teal/40 uppercase mb-3">
            Your Position
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-litvm-teal/50 font-sans">stLTC balance</span>
              <span className="text-litvm-heading font-display font-semibold">
                {parseFloat(formatEther(stLTCBalance)).toFixed(6)} stLTC
              </span>
            </div>
            {exchangeRate && (
              <div className="flex justify-between text-sm">
                <span className="text-litvm-teal/50 font-sans">≈ zkLTC value</span>
                <span className="text-emerald-400 font-display font-semibold">
                  {(
                    parseFloat(formatEther(stLTCBalance)) *
                    parseFloat(formatEther(exchangeRate))
                  ).toFixed(6)} zkLTC
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
