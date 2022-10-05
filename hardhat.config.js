require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')
const { getContractAt } = require('@nomiclabs/hardhat-ethers/internal/helpers')
const { task } = require('hardhat/config')

const { POLYGON_MUMBAI_PROVIDER_URL, MNEMONIC, NFT_CONTRACT_ADDRESS } = process.env

// Helper method for fetching a connection provider to the Ethereum network
function getProvider() {
  return new ethers.providers.JsonRpcProvider(POLYGON_MUMBAI_PROVIDER_URL)
}

// Helper method for fetching a wallet account using an environment variable for the PK
function getAccount() {
  return ethers.Wallet.fromMnemonic(MNEMONIC).connect(getProvider())
}

function getContract(contractName, hre) {
  const account = getAccount()
  return getContractAt(hre, contractName, NFT_CONTRACT_ADDRESS, account)
}

task('mint', 'Mints from the NFT contract')
  .addParam('address', 'The address to receive a token')
  .setAction(async function (taskArguments, hre) {
    const contract = await getContract('NFT', hre)
    const transactionResponse = await contract.mintTo(taskArguments.address, {
      gasLimit: 500_000,
    })
    console.log(`Transaction Hash: ${transactionResponse.hash}`)
  })

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.17',
  defaultNetwork: 'polygonMumbai',
  networks: {
    hardhat: {},
    polygonMumbai: {
      url: POLYGON_MUMBAI_PROVIDER_URL,
      accounts: { mnemonic: MNEMONIC },
    },
  },
}
