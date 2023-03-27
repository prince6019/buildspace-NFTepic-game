const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  console.log("deploying----------");
  console.log(deployer);

  const arguments = [
    ["Leo", "Aang", "Pikachu"],
    [
      "https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/WMB6g9u.png",
    ],
    [100, 200, 300],
    [100, 50, 25],
    "elon_musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50,
  ];

  const epicGame = await deploy("MyEpicGame", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfiramtions: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name)) {
    verify(epicGame.address, arguments);
    console.log("verified");
  }
};

module.exports.tags = ["epicgame", "all"];
