const { fs } = require("fs");
const { network, hre } = require("hardhat");
require("dotenv").config();
const frontendContractAddressFile =
  "./frontend/constants/ContractAddresses.json";
const frontendAbiFile = "./frontend/constants/abi.json";

const main = async () => {
  if (process.env.UPDATE_TO_FRONTEND) {
    console.log("writing to frontend");
    await updateContractAddresses();
    await updateAbi();
    console.log("frontend written");
  }
};

const updateAbi = async () => {
  const epicGame = await ethers.getContract("MyEpicGame");
  fs.writeFileSync(
    frontendAbiFile,
    epicGame.interface.format(ethers.utils.FormatTypes.json)
  );
};

const updateContractAddresses = async () => {
  const chainId = network.config.chainId.toString();
  const epicGame = await hre.ethers.getContract("MyEpicGame");
  const contractAddresses = JSON.parse(
    fs.readFileSync(frontendContractAddressFile, "utf8")
  );
  if (network.chainId in contractAddresses) {
    if (!contractAddresses[chainId].includes(epicGame.address)) {
      contractAddresses[chainId].push(epicGame.address);
    }
  } else {
    contractAddresses[chainId] = [nftmarketplace.address];
  }
  fs.writeFileSync(
    frontendContractAddressFile,
    JSON.stringify(contractAddresses)
  );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
