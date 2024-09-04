import React from "react";
import styles from "./Output.module.css";

const Outputs = ({ output }) => {
  return (
    <div className={styles.output_container}>
      <button className={styles.close_btn}>x</button>
      <pre className={styles.output}>
        {output ? output : "No output available"}
      </pre>
    </div>
  );
};

export default Outputs;
