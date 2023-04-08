import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3Contract } from "react-moralis";
// ---internal import
import styles from "./CharacterNft.module.css";
import Card from "../Card/Card";
import { Abi } from "@/constants/constantIndex";
import Link from "next/link";

const CharacterNft = ({ marketplaceAddress }) => {
  const [characterNfts, setCharacterNfts] = useState([]);
  const [userNft, setUserNft] = useState({});
  const [bossNft, setBossNft] = useState({});

  const { runContractFunction: getAlldefaultCharacters } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "getAlldefaultCharacters",
    params: {},
  });

  const { runContractFunction: getbigBoss } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "getbigBoss",
    params: {},
  });
  const { runContractFunction: attackBoss } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "attackBoss",
    params: {},
  });

  const { runContractFunction: requestRandomNumber } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "requestRandomNumber",
    params: {},
  });

  const {
    runContractFunction: mintCharacterNFT,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "mintCharacterNFT",
    params: {},
  });

  const { runContractFunction: checkIfUserHasNFT } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "checkIfUserHasNFT",
    params: {},
  });

  useEffect(() => {
    const callCharacterNft = async () => {
      const res = await getAlldefaultCharacters();
      const res1 = await checkIfUserHasNFT();
      console.log(res1);
      setUserNft(res1);
      setCharacterNfts(res);
      const bosscard = await getbigBoss();
      console.log(bosscard);
      setBossNft(bosscard);
    };
    callCharacterNft();
  }, [bossNft, userNft, characterNfts]);

  const handleSuccess = async (tx) => {
    try {
      await tx.wait(1);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMintNft = async () => {
    try {
      await requestRandomNumber({
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
      });
      await mintCharacterNFT({
        onSuccess: handleSuccess,
        onError: (error) => console.log(error),
      });
    } catch (e) {
      console.log(e);
    }
  };

  {
    if (userNft?.name !== "") {
      return (
        <div className={styles.arena}>
          <div className={styles.arena_container}>
            <Card
              name="gustavo fring"
              imageUri="https://ipfs.io/ipfs/QmeAaYHabSEwWQF4nTWm987DLFeFhUycpZAZBXgY6S8h1z?filename=gustavo_fring.jpg"
              attackDamage={bossNft?.attackDamage?.toString()}
              maxHp={bossNft?.maxHp?.toString()}
              hp={bossNft?.maxHp?.toString()}
            />
            <h3> VS</h3>
            <Card
              name={userNft?.name}
              imageUri={userNft?.imageUri}
              attackDamage={userNft?.attackDamage?.toString()}
              maxHp={userNft?.maxHp?.toString()}
              hp={userNft?.hp?.toString()}
            />
          </div>
          <button>Attack Boss</button>
        </div>
      );
    } else {
      return (
        <div className={styles.characternft}>
          <div className={styles.characternft_container}>
            <h3> Mint Your hero . Let the chainLink decide it for you </h3>
            <div className={styles.characternft_container_cardbox}>
              {characterNfts.map((ele, i) => (
                <Card
                  key={i}
                  name={ele.name}
                  imageUri={ele.imageUri}
                  attackDamage={ele.attackDamage.toString()}
                  maxHp={ele.maxHp.toString()}
                />
              ))}
            </div>
            <button onClick={handleMintNft} disabled={isLoading || isFetching}>
              {" "}
              Mint Nft
            </button>
          </div>
        </div>
      );
    }
  }
};

export default CharacterNft;
