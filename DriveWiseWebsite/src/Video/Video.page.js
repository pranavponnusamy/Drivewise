import React from "react";
import styles from "./Video.module.css";
export const Video = () => {
  return (
    <div>
      <h1>DriveWise Demo</h1>
      <iframe
        width="600"
        height="315"
        src="//www.youtube.com/embed/A9ToFxCVF9c"
        title="video"
        frameborder="0"
        allowfullscreen
        className={styles.video}
      ></iframe>
    </div>
  );
};
