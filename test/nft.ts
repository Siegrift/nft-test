import { ethers } from 'hardhat'
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { NFT, NFT__factory } from '../typechain-types'

describe('nft', () => {
  let roles: {
    deployer: SignerWithAddress
    alice: SignerWithAddress
    bob: SignerWithAddress
  }
  let nft: NFT

  beforeEach(async () => {
    const accounts = await ethers.getSigners()
    roles = {
      deployer: accounts[0]!,
      alice: accounts[1]!,
      bob: accounts[2]!,
    }

    const NftFactory = (await ethers.getContractFactory('NFT', roles.deployer)) as NFT__factory
    nft = await NftFactory.deploy(3)
  })

  it('deployer is the owner of the tokens', async () => {
    expect(await nft.ownerOf(0)).to.equal(roles.deployer.address)
    expect(await nft.ownerOf(1)).to.equal(roles.deployer.address)
    expect(await nft.ownerOf(2)).to.equal(roles.deployer.address)
    await expect(nft.ownerOf(3)).to.be.revertedWithCustomError(nft, 'OwnerQueryForNonexistentToken')
  })

  it('only owner can move the NFT', async () => {
    await expect(
      nft.connect(roles.alice).transferFrom(roles.deployer.address, roles.alice.address, 0),
    ).to.be.revertedWithCustomError(nft, 'TransferCallerNotOwnerNorApproved')

    await expect(nft.connect(roles.deployer).transferFrom(roles.deployer.address, roles.alice.address, 0)).not.to.be
      .reverted
  })

  it('allows the contract creator to redeem the tokens back', async () => {
    await nft.connect(roles.deployer).transferFrom(roles.deployer.address, roles.alice.address, 0)
    await expect(nft.connect(roles.deployer).redeem(roles.alice.address, 0)).not.to.be.reverted
  })

  it('cannot get back the owners approval', async () => {
    await expect(
      nft.connect(roles.alice).setApprovalForAll(roles.deployer.address, true),
    ).to.be.revertedWithCustomError(nft, 'InvalidApprovalOperator')
    await expect(
      nft.connect(roles.alice).setApprovalForAll(roles.deployer.address, false),
    ).to.be.revertedWithCustomError(nft, 'InvalidApprovalOperator')

    expect(await nft.isApprovedForAll(roles.alice.address, roles.deployer.address)).to.equal(true)
  })
})
