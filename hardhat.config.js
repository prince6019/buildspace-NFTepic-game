require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const QUICK_NODE_API_KEY = process.env.QUICK_NODE_API_KEY;

module.exports = {
  solidity: "0.8.18",
  networks: {
    goerli: {
      url: QUICK_NODE_API_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
};
