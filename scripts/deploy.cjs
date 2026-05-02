const { ethers } = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('Deploying with:', deployer.address)
  const bal = await ethers.provider.getBalance(deployer.address)
  console.log('Balance:', ethers.formatEther(bal), 'zkLTC\n')

  console.log('1/3 Deploying StakedLTC token...')
  const StakedLTC = await ethers.getContractFactory('StakedLTC')
  const stLTC = await StakedLTC.deploy()
  await stLTC.waitForDeployment()
  const stLTCAddr = await stLTC.getAddress()
  console.log('   StakedLTC:', stLTCAddr)

  console.log('2/3 Deploying LTCStaking vault...')
  const LTCStaking = await ethers.getContractFactory('LTCStaking')
  const staking = await LTCStaking.deploy(stLTCAddr)
  await staking.waitForDeployment()
  const stakingAddr = await staking.getAddress()
  console.log('   LTCStaking:', stakingAddr)

  console.log('3/3 Wiring staking contract into StakedLTC...')
  const tx = await stLTC.setStakingContract(stakingAddr)
  await tx.wait()
  console.log('   Done!\n')

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('NEXT_PUBLIC_STLTC_ADDRESS=' + stLTCAddr)
  console.log('NEXT_PUBLIC_STAKING_ADDRESS=' + stakingAddr)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main().catch((e) => { console.error(e); process.exitCode = 1 })
