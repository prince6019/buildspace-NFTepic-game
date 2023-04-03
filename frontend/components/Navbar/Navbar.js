import React from "react";
import { ConnectButton } from "@web3uikit/web3";

// ---internal import
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar_container}>
        <div className={styles.navbar_container_left}>
          <h3>⚔️ Metaverse Combat ⚔️</h3>
        </div>
        <div className={styles.navbar_container_right}>
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
