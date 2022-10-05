require('dotenv').config()
import '@nomicfoundation/hardhat-toolbox'
import { getContractAt } from '@nomiclabs/hardhat-ethers/internal/helpers'
import { task } from 'hardhat/config'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import fetch from 'node-fetch'
import { NFT } from './typechain-types'

const { POLYGON_MUMBAI_PROVIDER_URL, MNEMONIC, NFT_CONTRACT_ADDRESS } = process.env

// Helper method for fetching a connection provider to the Ethereum network
function getProvider(hre: HardhatRuntimeEnvironment) {
  return new hre.ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_PROVIDER_URL)
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount(hre: HardhatRuntimeEnvironment) {
  return hre.ethers.Wallet.fromMnemonic(MNEMONIC!).connect(getProvider(hre))
}

function getContract(hre: HardhatRuntimeEnvironment) {
  const account = getAccount(hre)
  return getContractAt(hre, 'NFT', NFT_CONTRACT_ADDRESS!, account) as Promise<NFT>
}

task('token-uri', 'Fetches the token metadata for the given token ID')
  .addParam('tokenId', 'The tokenID to fetch metadata for')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract(hre)
    const response = await contract.tokenURI(taskArguments.tokenId, {
      gasLimit: 500_000,
    })

    const metadata_url = response
    console.log(`Metadata URL: ${metadata_url}`)

    const metadata = await fetch(metadata_url, {}).then((res) => res.json())
    console.log(`Metadata fetch response: ${JSON.stringify(metadata, null, 2)}`)
  })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    polygonMumbai: {
      url: POLYGON_MUMBAI_PROVIDER_URL,
      accounts: { mnemonic: MNEMONIC },
    },
  },
}
