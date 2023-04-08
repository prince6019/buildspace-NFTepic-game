const { assert, expect } = require("chai");
const { network, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Epic Game unit test", () => {
      let deployer, epicGame, player;
      beforeEach(async () => {
        const accounts = await ethers.getSigners();
        deployer = accounts[0];
        player = accounts[1];
        await deployments.fixture(["all"]);
        epicGame = await ethers.getContract("MyEpicGame");
      });

      describe("constructor", () => {
        it("checks if NFTs data are properly stored in array", async () => {
          const characterArray = await epicGame.getAlldefaultCharacters();
          const tokenID = await epicGame.getTokenId();
          assert.equal(characterArray.length, 6);
          assert.equal(parseInt(tokenID), 1);
        });
      });

      describe("mintCharacterNFT", () => {
        it("generate random number and should mint the NFT", async () => {
          await epicGame.requestRandomNumber();
          const mintCharacterNFT = await epicGame.mintCharacterNFT();
          const tokenId = await epicGame.getTokenId();
          assert.equal(tokenId, 2);
        });
        it("emits an event after minting an NFT", async () => {
          await expect(epicGame.mintCharacterNFT()).to.emit(
            epicGame,
            "characterMintedNft"
          );
        });
      });

      // describe("attackBoss", () => {
      //   it("emits an event after attacking the boss", async () => {
      //     await epicGame.mintCharacterNFT(1);
      //     await expect(epicGame.attackBoss()).to.emit(
      //       epicGame,
      //       "attackComplete"
      //     );
      //   });
      // });
    });
