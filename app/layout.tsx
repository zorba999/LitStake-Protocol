import type { Metadata } from 'next'
import { Outfit, Rajdhani } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'LitStake Protocol — Liquid Staking on LitVM',
  description: 'Stake zkLTC on LitVM LiteForge Testnet and receive stLTC — a liquid yield-bearing receipt token.',
  openGraph: {
    title: 'LitStake Protocol',
    description: 'Liquid staking for Litecoin on LitVM',
    siteName: 'LitStake Protocol',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${rajdhani.variable}`}>
        <div className="glow-blob-1" />
        <div className="glow-blob-2" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
