networkConfig = {
  31337: {
    name: "hardhat",
    callbackGasLimit: "500000",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
  },
  11155111: {
    name: "sepolia",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625",
    subscriptionId: "928",
    callbackGasLimit: "500000",
  },
  5: {
    name: "goerli",
    gasLane:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    subscriptionId: "8182",
    callbackGasLimit: "2500000",
  },
};

const developmentChains = ["hardhat", "localhost"];
const frontEndContractsFile = "./frontend/constants/ContractAddresses.json";
const frontEndAbiFile = "./frontend/constants/abi.json";

module.exports = {
  developmentChains,
  frontEndAbiFile,
  frontEndContractsFile,
  networkConfig,
};
