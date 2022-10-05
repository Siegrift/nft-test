require('dotenv').config()
require('@nomicfoundation/hardhat-toolbox')

const { POLYGON_MUMBAI_PROVIDER_URL, MNEMONIC } = process.env

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
