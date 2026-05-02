import type { Metadata } from 'next'
import { Orbitron, Rajdhani, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  variable: '--font-display',
})

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
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
      <body className={`${orbitron.variable} ${rajdhani.variable} ${jetbrainsMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
