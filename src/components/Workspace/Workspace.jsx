import React, { useEffect, useRef, useState } from 'react'
import styles from './Workspace.module.css'
import logo from '../../assets/logo.png'
import toast from 'react-hot-toast'
import Client from '../Client/Client'
import Editor from '../Editor/Editor'
import {useLocation , useParams  , useNavigate } from 'react-router-dom'
import {initSocket} from '../../socket'
import Outputs from '../Outputs/Outputs'


const Workspace = () => {
  
    const [clients, setClients] = useState([]);

    const codeRef = useRef(null);
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const navigate = useNavigate();



    useEffect(()=>{
      const init = async ()=>{
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

          if(!location.state){
              navigate("/");
          }

          socketRef.current.emit("join", {
              roomId,
              username: location.state?.username,
          });

          socketRef.current.on("joined" , ({clients , username , socketId})=>{

              if(location.state?.username != username){
                toast.success(`${username} joined`)
              }
              
              console.log(codeRef.current)
              socketRef.current.emit("code-sync" , {
                socketId,
                code: codeRef.current
              })

              setClients(clients);
              
          })

      } catch (error) {
          console.log("Error initializing socket:", error);
          toast.error(`Error: ${error.message}`);
          navigate("/");
      }

      //disconnnected

      try{
        socketRef.current.on("disconnected" , ({socketId , username})=>{
          toast.success(`${username} left`);
          setClients((prevClients) => prevClients.filter((client) => client.socketId !== socketId));
        })
      }catch(err){
        console.log("Error disconnecting room");
        toast.error(`Error: ${err.message}`);
      }
      }
      init();



    }, [])



    const copyRoomId =()=>{
        navigator.clipboard.writeText(roomId)
        toast.success("Room Id copied")
    }

    const leaveRoom = () => {
      socketRef.current.emit("leave-room", { roomId, username: location.state?.username });
      navigate("/");
      toast.success("Room left");
  }
  

    const onCodeChange = (code)=>{
        codeRef.current = code;
        console.log("codechange:" , codeRef.current)
    }

  return (
    <div className={styles.container}>
    <div className={styles.client_panel}>
      <img
        src={logo}
        alt="Logo"
        className={styles.logo}
      />
      <hr className={styles.divider} />

      {/* Client list container */}
      <div className={styles.client_list}>
        <span className={styles.member_title}>Members</span>
        {clients && clients.map((client) => (
          <Client key={client.socketId} username={client.username} />
        ))}
      </div>

      <hr className={styles.divider} />
      {/* Buttons */}
      <div className={styles.action_btn}>
        <button className={styles.copy_btn} onClick={copyRoomId}>
          Copy Room ID
        </button>
        <button
          className={styles.leave_btn}
          onClick={leaveRoom}
        >
          Leave Room
        </button>
      </div>
    </div>

    {/* Editor panel */}
    <div className={styles.editor_panel}>
      <Editor socketRef={socketRef} roomId={roomId} onCodeChange={onCodeChange}/>
      <Outputs/>
    </div>
  </div>
  )
}

export default Workspace