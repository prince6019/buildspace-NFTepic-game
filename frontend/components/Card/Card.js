import React from "react";
// ---internal import
import styles from "./Card.module.css";
import images from "../../img/imgIndex";
const Card = ({ name, attackDamage, maxHp, imageUri, hp }) => {
  return (
    <div className={styles.card}>
      <div className={styles.card_container}>
        <img
          src={imageUri}
          alt="thomas shelby"
          width={200}
          height={300}
          className={styles.card_container_img}
        />
        <div className={styles.card_container_info}>
          <h3 className={styles.cardname}>{name}</h3>
          <p>MaxHp : {maxHp}</p>
          <p>Attack:{attackDamage}</p>
          <p>Hp : {hp}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
