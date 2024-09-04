// Home.jsx
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"; // Import the CSS module
import logo from "../../assets/logo.png"

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room Id is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    // Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("Room is created");
  };

  // Handle Enter key to join room
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.wrapper}>
          <div className={`${styles.card}`}>
            <div className={`${styles.cardBody}`}>
              <img
                src={logo}
                alt="Logo"
                className={`${styles.imgLogo}`}
              />
              <h4 className={`${styles.textLight}`}>
                Enter the ROOM ID
              </h4>

              <div className={styles.formGroup}>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className={styles.formControl}
                  placeholder="ROOM ID"
                  onKeyUp={handleInputEnter}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={styles.formControl}
                  placeholder="USERNAME"
                  onKeyUp={handleInputEnter}
                />
              </div>
              <button
                onClick={joinRoom}
                className={`${styles.btnBlock}`}
              >
                JOIN
              </button>
              <p className={`${styles.textLight}`}>
                Don't have a room ID? create{" "}
                <span
                  onClick={generateRoomId}
                  className={`${styles.textSuccess} ${styles.pointer}`}
                >
                  {" "}
                  New Room
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
