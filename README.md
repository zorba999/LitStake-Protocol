# LitStake Protocol

Liquid staking dApp built on **LitVM LiteForge Testnet** — stake zkLTC, receive stLTC, earn yield.

🔗 **Live app:** https://www.litstake.com

![LitVM](https://img.shields.io/badge/Network-LitVM%20LiteForge-64BFD3?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=flat-square&logo=vercel)

## What is it?

LitStake is a liquid staking protocol on LitVM — the first EVM-compatible Layer 2 on Litecoin. Deposit zkLTC (the native gas token) and receive **stLTC**, a yield-bearing receipt token whose value grows over time as rewards accrue in the vault.

- **Stake** zkLTC → receive stLTC at the current exchange rate
- **Hold** stLTC → its value appreciates as yield is injected
- **Unstake** anytime → burn stLTC → receive more zkLTC than you put in

## Contracts (LiteForge Testnet)

| Contract | Address |
|----------|---------|
| LTCStaking (vault) | `0x300F634A2EFc7bb4Ed45Ac7336352d3a7a3452d6` |
| StakedLTC (stLTC token) | `0xbCd13577B09BfC09C421E8B3DB99ee776Ee79C9E` |

## Network

| Parameter | Value |
|-----------|-------|
| Network Name | LitVM LiteForge Testnet |
| Chain ID | 4441 |
| RPC URL | `https://liteforge.rpc.caldera.xyz/http` |
| Currency | zkLTC |
| Explorer | https://liteforge.explorer.caldera.xyz |

## Tech Stack

- **Frontend** — Next.js 15 (App Router), Tailwind CSS, Rajdhani + Outfit fonts
- **Web3** — wagmi v2, viem v2, MetaMask (injected connector)
- **Contracts** — Solidity 0.8.24, OpenZeppelin v5, Hardhat
- **Deployment** — Vercel (frontend), LiteForge Testnet (contracts)

## Local Development

**1. Clone & install**

```bash
git clone https://github.com/zorba999/LitStake-Protocol.git
cd LitStake-Protocol
npm install
```

**2. Set up environment**

```bash
cp .env.example .env.local
```

Edit `.env.local` — the contract addresses are already filled in the example.

**3. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and connect MetaMask. The app will prompt you to switch to LitVM LiteForge automatically.

## Get Testnet Funds

Visit the [LiteForge Faucet](https://liteforge.hub.caldera.xyz) to get free zkLTC for testing.

## Contract Architecture

```
User
 │
 ├─ stake(msg.value) ──────────► LTCStaking.sol
 │                                 │  holds zkLTC balance
 │                                 │  calculates exchange rate
 │                                 │  mints stLTC via →
 │                                 ▼
 │                               StakedLTC.sol (ERC20)
 │
 └─ unstake(stLTCAmount) ──────► LTCStaking.sol
                                   │  burns stLTC
                                   │  sends zkLTC back at current rate
                                   ▼
                                 User receives zkLTC + yield
```

Exchange rate formula: `rate = totalAssets * 1e18 / stLTC.totalSupply()`

## Deploy Contracts (optional)

```bash
# Add your private key to .env.local
PRIVATE_KEY=your_key_here
LITEFORGE_RPC_URL=https://liteforge.rpc.caldera.xyz/http

npx hardhat run scripts/deploy.cjs --network liteforge
```

## Links

- [LitVM Docs](https://docs.litvm.com)
- [LiteForge Explorer](https://liteforge.explorer.caldera.xyz)
- [LiteForge Faucet](https://liteforge.hub.caldera.xyz)
