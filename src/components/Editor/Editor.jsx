import React, { useEffect, useRef } from "react";
import styles from "./Editor.module.css";
import codeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";

const Editor = ({socketRef , roomId , onCodeChange}) => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = codeMirror.fromTextArea(editorRef.current, {
      lineNumbers: true,
      mode: "text/javascript",
      theme: "dracula",
      autoCloseBrackets: true,
      autoCloseTags: true,
    });

    editorRef.current = editor;

    // CodeMirror Editor
    editor.setSize(null, "100%");

    editor.on("change", (instance, changes) => {
      // console.log("changes : ", instance, changes);
      const { origin } = changes;
      const code = instance.getValue();
      onCodeChange(code);

      if(origin !== "setValue") {
        socketRef.current.emit("code-change" , {
          roomId ,
          code
        })
      }

    });

  }, []);

  useEffect(() => {
    if(socketRef.current) {
      socketRef.current.on("code-change" , ({code}) => {
        if(code != null) {
          editorRef.current.setValue(code);
        }
      })
    }
  } , [socketRef.current])
  return (
    <div className={styles.container}>
      <textarea ref={editorRef} id="realTime_editor" />
    </div>
  );
};

export default Editor;
