import React from "react";
import { Landing } from "./Landing/Landing.page";
import styles from "./MainNavigator.module.css";
import { Features } from "./Features/Features.page";
import { Video } from "./Video/Video.page";

export const MainNavigator = () => {
  return (
    <div className={styles.firstContainer}>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <Landing />
          <Features />
          <Video />
        </div>
      </div>
    </div>
  );
};
