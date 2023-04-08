const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

const VRF_FUND_AMOUNT = ethers.utils.parseEther("2");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;
  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const VRFCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    const transactionResponse = await VRFCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait();
    subscriptionId = transactionReceipt.events[0].args.subId;

    await VRFCoordinatorV2Mock.fundSubscription(
      subscriptionId,
      VRF_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

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
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId]["gasLane"],
    networkConfig[chainId]["callbackGasLimit"],
  ];

  console.log("deploying----------");
  console.log(deployer);

  const epicGame = await deploy("MyEpicGame", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfiramtions: network.config.blockConfirmations || 1,
  });

  log("deployed------");

  // Ensure the lottery contract is a valid consumer of the vrfCoordinatorV2Mock contract.
  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    await vrfCoordinatorV2Mock.addConsumer(subscriptionId, epicGame.address);
  }

  if (!developmentChains.includes(network.name)) {
    verify(epicGame.address, arguments);
    console.log("verified");
  }
};

module.exports.tags = ["epicgame", "all"];
