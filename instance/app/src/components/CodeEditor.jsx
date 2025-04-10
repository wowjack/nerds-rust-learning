import { useState, useEffect } from 'react';
import OutputBox from "./OutputBox";
import WasmRunner from "./WasmRunner";
import ControlButton from "./ControlButton";
import useTaskState from "../hooks/useTaskState";
import useSavedState from "../hooks/useSavedState";
import {isUndefined} from "../util";
import "./CodeEditor.css";

import Editor from "@monaco-editor/react";

export default function CodeEditor(props) {
  // state that we have from props:
  // suggestions  <array>     snippet suggestions
  // real_taskno  <int>       task number in the original ordering
  // output       <string>    the code output
  // editorRef    <ref>       Reference to the editor instance
  const [output, setOutput] = props.output;
  const placeholder_code = props.task?.placeholder_code;
  const taskno = props.taskno
  const editorValue = props.editor_value;
  const setEditorValueBackend = props.set_editor_value;

  /* Used to store if we've loaded the saved state into the monaco model */
  const [loadedArr, setLoadedArr] = useState([]);
  const loaded = isUndefined(loadedArr[taskno]) ? false : loadedArr[taskno];
  const setLoaded = (v) => setLoadedArr(loadedArr => {
    loadedArr[props.taskno] = v;
    return loadedArr;
  });

  if (props.taskno == undefined) {
    console.error("real_taskno is undefined");
  }

  function handleEditorDidMount(editor, monaco) {
    console.debug("handleEditorDidMount");
    props.editorRef.current = editor;

  }

  function handleBeforeUnload(e) {
    e.preventDefault();
  }

  function setEditorValue(v) {
    if (props.editorRef.current && typeof v === "string") {
      // Do this to avoid triggering our own onEditorDidChange method when we set the editor value
      props.editorRef.current.setValue(v);
      setEditorValueBackend(v);
    } else if (!props.editorRef.current && typeof v === "string") {
      setEditorValueBackend(v);
    } else if (typeof v !== "string") {
      throw new Error(`setEditorValue called with an ${typeof v}, must be called with a string`);
    }
  }

  if (editorValue === "" && placeholder_code !== "") {
    setEditorValue(placeholder_code)
  }
  

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      //if (e.shiftKey) {
      //  handlePrev();
      //} else {
      //  handleNext();
      //}
      e.preventDefault();
    }
  }

  function handleEditorDidChange(value, e) {
    console.debug(`Handling editor did change on task ${props.taskno}`);
    setEditorValueBackend(value);
  }

  // Setup listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return (() => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("beforeunload", handleBeforeUnload);
    });
  });


  return (
    <div id="editorContainer">
      <div id="controlsBox">
        <WasmRunner
          editor={props.editorRef}
          output={output}
          setOutput={setOutput}
          compile_code={props.compile_code}
          taskno={props.taskno} />
      </div>
      <Editor
        language={"Rust"}
        options={{domReadOnly: false, readOnly: false}}
        path={`task${props.taskno}`}
        defaultValue={editorValue}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        onChange={handleEditorDidChange}
        wrapperProps={{"style":{"flex":"2 1 400px", "minHeight":"200px", "padding": "0.5em"}}}
        keepCurrentModel={true}
        className="editorBox" />
      <OutputBox output={output}/>
    </div>
  )
}
