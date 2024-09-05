import React, { useEffect, useRef, useState } from "react";
import styles from "./Workspace.module.css";
import toast from "react-hot-toast";
import Client from "../Client/Client";
import Editor from "../Editor/Editor";
import Outputs from "../Outputs/Outputs";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { initSocket } from "../../socket";
import logo from "../../assets/logo.png";

const Workspace = () => {
  const [clients, setClients] = useState([]);
  const [outputHeight, setOutputHeight] = useState(200); // default output height
  const codeRef = useRef(null);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();
        socketRef.current.on("connect", () => {
          console.log("Connected to socket server:", socketRef.current.id);
        });

        socketRef.current.on("connect_error", (err) => {
          console.log("Connection error:", err.message);
          toast.error("Socket connection failed, try again later.");
          navigate("/");
        });

        if (!location.state) {
          navigate("/");
        }

        socketRef.current.emit("join", {
          roomId,
          username: location.state?.username,
        });

        socketRef.current.on("joined", ({ clients, username, socketId }) => {
          if (location.state?.username !== username) {
            toast.success(`${username} joined`);
          }

          console.log(codeRef.current);
          socketRef.current.emit("code-sync", {
            socketId,
            code: codeRef.current,
          });

          setClients(clients);
        });
      } catch (error) {
        console.log("Error initializing socket:", error);
        toast.error(`Error: ${error.message}`);
        navigate("/");
      }

      socketRef.current.on("disconnected", ({ socketId, username }) => {
        toast.success(`${username} left`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.socketId !== socketId)
        );
      });
    };
    init();
  }, [location, navigate, roomId]);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toast.success("Room ID copied");
  };

  const leaveRoom = () => {
    socketRef.current.emit("leave-room", {
      roomId,
      username: location.state?.username,
    });
    navigate("/");
    toast.success("Room left");
  };

  const onCodeChange = (code) => {
    codeRef.current = code;
  };

  return (
    <div className={styles.container}>
      <div className={styles.client_panel}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <hr className={styles.divider} />

        <div className={styles.client_list}>
          <span className={styles.member_title}>Members</span>
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>

        <hr className={styles.divider} />

        <div className={styles.action_btn}>
          <button className={styles.copy_btn} onClick={copyRoomId}>
            Copy Room ID
          </button>
          <button className={styles.leave_btn} onClick={leaveRoom}>
            Leave Room
          </button>
        </div>
      </div>

      <div className={styles.editor_panel}>
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={onCodeChange}
          style={{ height: `calc(100% - ${outputHeight}px)`, width: "100%" }}
        />

        <Outputs
          socketRef={socketRef}
          codeRef={codeRef}
          setOutputHeight={setOutputHeight}
          outputHeight={outputHeight}
        />
      </div>
    </div>
  );
};

export default Workspace;
