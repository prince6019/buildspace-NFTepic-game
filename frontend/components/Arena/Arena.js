import React, { useState, useEffect } from "react";
import styles from "./Arena.module.css";
import { useWeb3Contract } from "react-moralis";
import { Abi } from "@/constants/constantIndex";
import Card from "../Card/Card";

const Arena = ({ marketplaceAddress }) => {
  const [userNft, setUserNft] = useState({});
  const [bossNft, setBossNft] = useState({});

  const { runContractFunction: checkIfUserHasNFT } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "checkIfUserHasNFT",
    params: {},
  });

  const { runContractFunction: getbigBoss } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "getbigBoss",
    params: {},
  });

  useEffect(() => {
    const getCards = async () => {
      const res = await checkIfUserHasNFT();
      console.log(res);
      setUserNft(res);

      const bosscard = await getbigBoss();
      console.log(bosscard);
      setBossNft(bosscard);
    };
    getCards();
  }, []);

  return (
    <div className={styles.arena}>
      <div className={styles.arena_container}>
        <Card
          name="gustavo fring"
          imageUri="https://ipfs.io/ipfs/QmeAaYHabSEwWQF4nTWm987DLFeFhUycpZAZBXgY6S8h1z?filename=gustavo_fring.jpg"
          attackDamage={bossNft.attackDamage.toString()}
          maxHp={bossNft.maxHp.toString()}
        />
        <h3> VS</h3>
        <Card
          name={userNft.name}
          imageUri={userNft.imageUri}
          attackDamage={userNft.attackDamage.toString()}
          maxHp={userNft.maxHp.toString()}
        />
      </div>
    </div>
  );
};

export default Arena;
