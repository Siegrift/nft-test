import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { MultiNFT, MultiNFT__factory } from '../typechain-types'

describe('multi-nft', () => {
  let roles: {
    deployer: SignerWithAddress
    alice: SignerWithAddress
    bob: SignerWithAddress
  }
  let multiNft: MultiNFT

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    roles = {
      deployer: accounts[0]!,
      alice: accounts[1]!,
      bob: accounts[2]!,
    }

    const NftFactory = (await ethers.getContractFactory('MultiNFT', roles.deployer)) as MultiNFT__factory
    multiNft = await NftFactory.deploy()
    await multiNft.connect(roles.alice).mint(10, '0x')
    await multiNft.connect(roles.bob).mint(15, '0x')
  })

  it('checks balances of the token owners', async () => {
    expect(await multiNft.balanceOf(roles.alice.address, roles.alice.address)).to.equal(10)
    expect(await multiNft.balanceOf(roles.bob.address, roles.bob.address)).to.equal(15)

    expect(await multiNft.balanceOf(roles.alice.address, roles.bob.address)).to.equal(0)
  })

  it('only owner can move the NFT', async () => {
    await expect(
      multiNft
        .connect(roles.alice)
        .safeTransferFrom(roles.bob.address, roles.alice.address, roles.bob.address, 5, '0x'),
    ).to.be.revertedWithCustomError(multiNft, 'SenderNotOwner')

    await expect(
      multiNft
        .connect(roles.alice)
        .safeTransferFrom(roles.alice.address, roles.bob.address, roles.alice.address, 5, '0x'),
    ).not.to.be.reverted
    expect(await multiNft.balanceOf(roles.bob.address, roles.alice.address)).to.equal(5)
  })

  it('allows the contract creator to redeem the tokens back', async () => {
    multiNft.connect(roles.alice).safeTransferFrom(roles.alice.address, roles.bob.address, roles.alice.address, 5, '0x')
    await expect(multiNft.connect(roles.alice).redeem(roles.bob.address)).not.to.be.reverted
    expect(await multiNft.balanceOf(roles.bob.address, roles.alice.address)).to.equal(0)
    expect(await multiNft.balanceOf(roles.alice.address, roles.alice.address)).to.equal(10)
  })
})
