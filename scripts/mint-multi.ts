import { ethers } from 'hardhat'
import { MultiNFT__factory } from '../typechain-types'

async function main() {
  // Get our account (as deployer) to verify that a minimum wallet balance is available
  const [account1, account2] = await ethers.getSigners()

  console.log(`Minting with the account: ${account1!.address}`)
  console.log(`Account balance: ${(await account1!.getBalance()).toString()}`)
  const tokenId = ethers.BigNumber.from(account1!.address)
  console.log(`Token ID: ${tokenId}`)

  // TODO: Read from .env
  const multiNft = MultiNFT__factory.connect('0x61e959238201db99a62388b6737bf76c82755653', account1!)

  const tx1 = await multiNft.mint(50, '0x')
  await tx1.wait(1)

  const tx2 = await multiNft.safeTransferFrom(account1!.address, account2!.address, account1!.address, 10, '0x')
  await tx2.wait(1)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
