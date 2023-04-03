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
    [
      "asac_schrader",
      "deadpool",
      "thomas_shelby",
      "shinchan",
      "jesse_pinkman",
      "mr_bean",
    ],
    [
      "https://ipfs.io/ipfs/QmXzfPP7J8qFTRmaYeY5CJ3mUU91MiBNHp2g4QRncxsmTy?filename=asac_schrader.webp",
      "https://ipfs.io/ipfs/QmU2ZS3JuHVQgCKcFRZQNVWXvkVtq9r8uyGu3ntsCKf5C2?filename=deadpool.jpg",
      "https://ipfs.io/ipfs/QmZfJjNCNBMEq2uAjmC4NiFYfHUgc17iSUwGVqTH8nwiYd?filename=thomas_shelby.jpg",
      "https://ipfs.io/ipfs/QmQv2pFohZEEQpmSCrAEukUDiMmtP8hgUxiXTU7T4wAt1N?filename=shinchan.webp",
      "https://ipfs.io/ipfs/QmQEFohJnJ5z49awTap1r86tn5A8hAr3V2QPzCjacmE43g?filename=jesse_pinkman.jpg",
      "https://ipfs.io/ipfs/QmSJnZBQuihoLxqkKiESdWJDh2NwoqpabPAMc97nkX9RUF?filename=Mr_bean.jpg",
    ],
    [300, 500, 400, 350, 400, 450],
    [350, 400, 500, 450, 300, 400],
    3000,
    500,
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
