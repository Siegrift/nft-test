import { ethers } from 'hardhat'

async function main() {
  // Get our account (as deployer) to verify that a minimum wallet balance is available
  const [deployer] = await ethers.getSigners()

  console.log(`Deploying contracts with the account: ${deployer!.address}`)
  console.log(`Account balance: ${(await deployer!.getBalance()).toString()}`)

  // Fetch the compiled contract using ethers.js
  const MultiNFT = await ethers.getContractFactory('MultiNFT')
  // calling deploy() will return an async Promise that we can await on
  const multiNft = await MultiNFT.deploy()

  console.log(`Contract deployed to address: ${multiNft.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
