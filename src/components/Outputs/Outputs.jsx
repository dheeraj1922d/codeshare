import React, { useState } from "react";
import styles from "./Output.module.css";
import { useRef , useEffect} from "react";
import { useParams } from "react-router-dom"

const Outputs = ({ socketRef ,  codeRef, setOutputHeight, outputHeight }) => {
  //logic for resizing
  const outputRef = useRef(null);
    const isResizing = useRef(false);
    const startY = useRef(0);
    const startHeight = useRef(0);

    const handleMouseDown = (e) => {
        isResizing.current = true;
        startY.current = e.clientY;
        startHeight.current = outputRef.current.offsetHeight;

        document.body.style.cursor = "ns-resize";
        document.body.style.userSelect = "none";

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;

        const newHeight = startHeight.current - (e.clientY - startY.current);

        if (newHeight > 100) { // Set a minimum height for the output container
            setOutputHeight(newHeight);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    };

  /************* resizing**********/

  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {roomId} = useParams();


  const runCode = async () => {
    if (socketRef.current) {
      const code = codeRef.current;
      if(!code) return ;
      console.log("code : " , code)
      setIsLoading(true);
      socketRef.current.emit("run-code", {
        roomId,
        code: code,
        language: "javascript",
      });
    }
  };


  // Listen for "run-code" event from the server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("run-code", ({ result, err }) => {
        console.log("Result received from server:", result); // Debugging
        setIsLoading(false);
        if (err) {
          setOutput(`Error: ${err.message}`);
        } else {
          setOutput(result.output.split("\n"));
        }
      });
    }

    // Cleanup event listener on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off("run-code");
      }
    };
  }, [socketRef.current]);

  return (
    <div
      className={styles.output_container}
      ref={outputRef}
      style={{ height: `${outputHeight}px` }}
    >
      <div className={styles.resizer} onMouseDown={handleMouseDown}></div>
      <button className={styles.run_button} onClick={runCode} disabled={isLoading}>
        {isLoading ? "loading.." : "Run Code"}
      </button>
      <div className={styles.output}>
        {output
          ? output.map((line, i) => <pre key={i}>{line}</pre>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Outputs;
