import React, { useEffect } from 'react'
import { useRef } from 'react';// Import the codemirror module
import 'codemirror/mode/javascript/javascript';     // Code mirror mode for javascript
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import "codemirror/lib/codemirror.css"; // Code mirror css
import CodeMirror from "codemirror"; 
import { Socket } from 'socket.io-client';





// code editor

function Editor({socketRef , roomId , onCodeChange}) {
  const editorRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realTimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
  
      // for sync code
      editorRef.current = editor;
      editor.setSize(null, "100%");
  
      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== 'setValue' && socketRef.current) {
          socketRef.current.emit("code-change", {
            roomId,
            code,
          });
        }
      });
    };
  
    init(); 
  }, []);
  

  useEffect(()=>{
    if(socketRef.current){
       socketRef.current.on("code-change", ({code})=>{
   if(code != null){
    editorRef.current.setValue(code);
   }
       });
    }
    return ()=> {
      socketRef.current.off("code-change");
    };
  },[socketRef.current]);

  return (
    <div style={{height:"600px"}}>
        <textarea id="realTimeEditor" spellCheck="false"></textarea>
    </div> 
  )
}

export default Editor