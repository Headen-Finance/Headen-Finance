/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('hardhat-contract-sizer');

module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
