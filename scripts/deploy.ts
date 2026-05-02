import { ethers } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying with:', deployer.address)
  console.log('Balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)), 'zkLTC')
  console.log()

  // 1. Deploy StakedLTC token
  console.log('Deploying StakedLTC...')
  const StakedLTC = await ethers.getContractFactory('StakedLTC')
  const stLTC = await StakedLTC.deploy()
  await stLTC.waitForDeployment()
  const stLTCAddress = await stLTC.getAddress()
  console.log('StakedLTC deployed to:', stLTCAddress)

  // 2. Deploy LTCStaking vault
  console.log('Deploying LTCStaking...')
  const LTCStaking = await ethers.getContractFactory('LTCStaking')
  const staking = await LTCStaking.deploy(stLTCAddress)
  await staking.waitForDeployment()
  const stakingAddress = await staking.getAddress()
  console.log('LTCStaking deployed to:', stakingAddress)

  // 3. Wire staking contract into the token
  console.log('Setting staking contract in StakedLTC...')
  const tx = await stLTC.setStakingContract(stakingAddress)
  await tx.wait()
  console.log('Done!')

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Add these to your .env.local:')
  console.log(`NEXT_PUBLIC_STLTC_ADDRESS=${stLTCAddress}`)
  console.log(`NEXT_PUBLIC_STAKING_ADDRESS=${stakingAddress}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})
