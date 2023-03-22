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
    [100, 50, 25],
    "elon_musk",
    "https://i.imgur.com/AksR0tt.png",
    10000,
    50
  );

  await epicGame.deployed();

  console.log(`deployed at ${epicGame.address}`);

  // let txn;
  // txn = await epicGame.mintCharacterNFT(0);
  // await txn.wait();
  // console.log("Minted NFt #1");
  // let returnedTokenUri = await epicGame.tokenURI(1);
  // console.log("returned tokenURI : ", returnedTokenUri);

  // txn = await epicGame.attackBoss();
  // txn.wait();

  // txn = await epicGame.mintCharacterNFT(1);
  // console.log("MInted Nft #2");

  // txn = await epicGame.mintCharacterNFT(2);
  // console.log("Minted Nft #3");

  // txn = await epicGame.mintCharacterNFT(1);
  // console.log("Minted Nft #4");

  // console.log("Done deploying and minting");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
