import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./CharacterNft.module.css";
import { Abi } from "@/constants/constantIndex";
import { useWeb3Contract } from "react-moralis";

const CharacterNft = ({ marketplaceAddress }) => {
  const [characterNfts, setCharacterNfts] = useState([{}]);
  const [characterIndex, setCharacterIndex] = useState(0);

  const { runContractFunction: getAlldefaultCharacters } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "getAlldefaultCharacters",
    params: {},
  });

  const { runContractFunction: mintCharacterNFT } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "mintCharacterNFT",
    params: {
      _characterIndex: characterIndex,
    },
  });
  // useEffect(() => {
  //   const callCharacterNft = async () => {
  //     const res = await getAlldefaultCharacters();
  //     setCharacterNfts(res);
  //   };
  //   callCharacterNft();
  // }, []);

  const callCharacterNft = async () => {
    const res = await getAlldefaultCharacters();
    setCharacterNfts(res);
    console.log(res);
  };

  const mintNft = async (i) => {
    setCharacterIndex(i);
    await mintCharacterNFT();
  };

  return (
    <div className={styles.characternft}>
      <div className={styles.characternft_container}>
        <h3> Mint Your hero . Choose wisely </h3>
        {/* {characterNfts.map((ele, i) => (
          <div
            key={i}
            className={styles.characternft_container_box}
            onClick={() => mintNft(i)}
          >
            <img src={ele.imageUri} alt="nft" height={300} width={300} />;
            <p>
              mint {""}
              {ele.name}
            </p>
          </div>
        ))} */}
        <button onClick={() => callCharacterNft()}>mintNft</button>
      </div>
    </div>
  );
};

export default CharacterNft;
