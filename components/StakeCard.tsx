'use client'

import { useState, useEffect } from 'react'
import { useStaking } from '@/hooks/useStaking'
import { useAccount, useChainId } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { ArrowDownUp, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { litVMTestnet } from '@/lib/chains'

type Tab = 'stake' | 'unstake'

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })

function shortenHash(hash: string) {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function StakeCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [tab, setTab] = useState<Tab>('stake')
  const [amount, setAmount] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { zkLTCBalance, stLTCBalance, exchangeRate, previewStake, previewUnstake, stake, unstake } = useStaking()

  const wrongNetwork = isConnected && chainId !== litVMTestnet.id

  useEffect(() => { setAmount(''); setTxHash(null); setError(null) }, [tab])

  const maxBalance   = tab === 'stake' ? zkLTCBalance : stLTCBalance
  const maxFormatted = maxBalance !== undefined ? parseFloat(formatEther(maxBalance)) : 0
  const inputSym     = tab === 'stake' ? 'zkLTC' : 'stLTC'
  const outSym       = tab === 'stake' ? 'stLTC' : 'zkLTC'

  const num = parseFloat(amount) || 0

  const previewVal = (() => {
    if (!amount || num <= 0) return 0
    try {
      const parsed = parseEther(amount)
      const result = tab === 'stake' ? previewStake(parsed) : previewUnstake(parsed)
      return result ? parseFloat(formatEther(result)) : 0
    } catch { return 0 }
  })()

  const handleMax = () => {
    const val = tab === 'stake' ? Math.max(0, maxFormatted - 0.001) : maxFormatted
    setAmount(val > 0 ? val.toString() : '0')
  }

  const handleSubmit = async () => {
    setError(null); setTxHash(null)
    if (!amount || num <= 0) { setError('Enter an amount'); return }
    setLoading(true)
    try {
      const hash = tab === 'stake' ? await stake(amount) : await unstake(amount)
      setTxHash(hash)
      setAmount('')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg.includes('rejected') ? 'Transaction rejected' : msg.slice(0, 120))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass glass-hover rounded-3xl p-6 md:p-8 animate-fade-up">
      {/* Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted/40 p-1">
        {(['stake', 'unstake'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg py-2.5 font-display text-sm font-bold uppercase tracking-widest transition ${
              tab === t ? 'bg-primary/15 text-primary text-glow' : 'text-muted-foreground hover:text-foreground'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Deposit input */}
      <div className="mt-6 rounded-2xl border border-border/70 bg-background/40 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-body">
          <span>You {tab === 'stake' ? 'deposit' : 'burn'}</span>
          <span>
            Balance:{' '}
            <button onClick={handleMax} className="font-mono text-foreground/80 hover:text-primary transition-colors">
              {fmt(maxFormatted)}
            </button>
          </span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder="0.000000"
            inputMode="decimal"
            className="w-full bg-transparent font-mono text-3xl font-semibold text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
          <button onClick={handleMax}
            className="rounded-md border border-primary/40 px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors">
            MAX
          </button>
          <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 font-display text-sm font-bold text-primary">
            {inputSym}
          </div>
        </div>
      </div>

      {/* Arrow */}
      <div className="my-2 flex justify-center">
        <div className="rounded-full border border-primary/30 bg-background p-2 text-primary">
          <ArrowDownUp className="h-4 w-4" />
        </div>
      </div>

      {/* Output preview */}
      <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
        <div className="text-xs text-muted-foreground font-body">You receive (est.)</div>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="font-mono text-2xl text-primary text-glow">{fmt(previewVal)}</span>
          <span className="font-display text-sm font-bold text-primary">{outSym}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-border/60 pt-3 text-xs font-mono text-muted-foreground">
          <span>Exchange rate</span>
          <span>1 stLTC = {exchangeRate ? parseFloat(formatEther(exchangeRate)).toFixed(6) : '1.000000'} zkLTC</span>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/8 p-3">
          <p className="text-destructive text-sm font-body">{error}</p>
        </div>
      )}

      {/* Success */}
      {txHash && (
        <div className="mt-4 rounded-xl border border-success/30 bg-success/8 p-3 flex items-center justify-between">
          <p className="text-success text-sm font-display font-semibold">Transaction sent!</p>
          <a href={`https://liteforge.explorer.caldera.xyz/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:text-foreground font-mono transition-colors">
            {shortenHash(txHash)} <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Submit */}
      {!isConnected ? (
        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-muted-foreground text-sm font-display tracking-wide">
            Connect your wallet to start staking
          </p>
        </div>
      ) : (
        <button
          onClick={handleSubmit}
          disabled={!num || loading || wrongNetwork}
          className="btn-glow mt-5 h-14 w-full font-display text-base font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Processing</span>
            : <span className="flex items-center justify-center gap-2"><Sparkles className="h-5 w-5" /> {tab === 'stake' ? 'Stake zkLTC' : 'Unstake stLTC'}</span>
          }
        </button>
      )}

      {/* Position */}
      {isConnected && stLTCBalance !== undefined && stLTCBalance > 0n && (
        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-primary">Your Position</span>
            {address && (
              <a href={`https://liteforge.explorer.caldera.xyz/address/${address}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors font-body">
                explorer <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground font-body">stLTC Balance</div>
              <div className="font-mono text-lg text-foreground">
                {fmt(parseFloat(formatEther(stLTCBalance)))}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-body">zkLTC Value</div>
              <div className="font-mono text-lg text-success">
                {exchangeRate
                  ? fmt(parseFloat(formatEther(stLTCBalance)) * parseFloat(formatEther(exchangeRate)))
                  : fmt(parseFloat(formatEther(stLTCBalance)))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
