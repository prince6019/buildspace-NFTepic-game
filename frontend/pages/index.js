import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Image from "next/image";
// ---internal import
import styles from "@/styles/Home.module.css";
import { ContractAddresses, Abi } from "@/constants/constantIndex";
import CharacterNft from "@/components/CharacterNft/CharacterNft";
import images from "../img/imgIndex";
import Arena from "@/components/Arena/Arena";

export default function Home() {
  const { isWeb3Enabled, chainId: chainIdHex } = useMoralis();
  const [characterNfts, setCharacterNfts] = useState(false);
  const chainId = parseInt(chainIdHex);

  const marketplaceAddress =
    chainId in ContractAddresses ? ContractAddresses[chainId][0] : null;

  const { runContractFunction: checkIfUserHasNFT } = useWeb3Contract({
    contractAddress: marketplaceAddress,
    abi: Abi,
    functionName: "checkIfUserHasNFT",
    params: {},
  });

  useEffect(() => {
    const getuserNft = async () => {
      const res = await checkIfUserHasNFT();
      console.log(res);
      if (res !== undefined) {
        setCharacterNfts(true);
      }
    };
    getuserNft();
  }, []);

  if (!isWeb3Enabled) {
    return (
      <div className={styles.home}>
        <div className={styles.home_container}>
          <p>Team up to protect the metaverse</p>
          <div className={styles.home_container_box}>
            <Image
              src={images.poster}
              alt="Marvel's poster"
              height={600}
              width={800}
              className={styles.home_container_box_img}
            />
            <p> Connect Wallet to get started</p>
          </div>
        </div>
      </div>
    );
  } else if (isWeb3Enabled && !characterNfts) {
    return (
      <div className={styles.home}>
        <div className={styles.home_container}>
          <p>Team up to protect the metaverse</p>
          <div className={styles.home_container_box}>
            <CharacterNft marketplaceAddress={marketplaceAddress} />
          </div>
        </div>
      </div>
    );
  }
}
