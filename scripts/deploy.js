const hre = require("hardhat");

async function main() {
  const epicgame = await hre.ethers.getContractFactory("MyEpicGame");
  const epicGame = await epicgame.deploy(
    ["Leo", "Aang", "Pikachu"],
    [
      "https://i.imgur.com/pKd5Sdk.png",
      "https://i.imgur.com/xVu4vFL.png",
      "https://i.imgur.com/WMB6g9u.png",
    ],
    [100, 200, 300],
    [100, 50, 25]
  );

  await epicGame.deployed();

  console.log(`deployed at ${epicGame.address}`);

  let txn;
  txn = await epicGame.mintCharacterNFT(2);
  await txn.wait();
  let returnedTokenuri = await epicGame.tokenURI(1);
  console.log("Token URI", returnedTokenuri);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
