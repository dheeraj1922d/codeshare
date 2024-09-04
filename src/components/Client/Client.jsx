import React from "react";
import styles from "./Client.module.css";
import Avatar from "react-avatar";

const Client = ({username}) => {
  return (
    <div className={styles.client}>
      <Avatar
        name={username?.toString()}
        size={50}
        round="14px"
        className="mr-3"
      />
      <span className={styles.username}>{username.toString()}</span>
    </div>
  );
};

export default Client;
