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
          assert(characterArray[0].name.toString() == "Leo");
          assert(characterArray[1].name.toString() == "Aang");
          assert(characterArray[2].name.toString() == "Pikachu");
          assert.equal(parseInt(tokenID), 1);
        });
      });

      describe("mintCharacterNFT", () => {
        it("should mint the NFT", async () => {
          const mintCharacterNFT = await epicGame.mintCharacterNFT(1);
          const tokenId = await epicGame.getTokenId();
          const characterAttribure = await epicGame.checkIfUserHasNFT();
          assert.equal(tokenId, 2);
          assert.equal(characterAttribure.name, "Aang");
        });
        it("emits an event after minting an NFT", async () => {
          await expect(epicGame.mintCharacterNFT(1)).to.emit(
            epicGame,
            "characterMintedNft"
          );
        });
      });

      describe("attacckBoss", () => {
        it("emits an event after attacking the boss", async () => {
          await epicGame.mintCharacterNFT(1);
          await expect(epicGame.attackBoss()).to.emit(
            epicGame,
            "attackComplete"
          );
        });
      });
    });
