import { Component, createEffect, onMount } from "solid-js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "./useWorker";

type EditorProps = {
  text: string;
  onTextChange?: (text: string) => void;
};

export const Editor: Component<EditorProps> = (props) => {
  let container: HTMLDivElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  onMount(() => {
    editor = monaco.editor.create(container, {
      value: props.text,
      automaticLayout: true,
      minimap: { enabled: false },
      theme: "vs-dark",
      language: "typescript",
    });

    editor.onDidChangeModelContent(() => {
      if (props.onTextChange) props.onTextChange(editor.getValue());
    });
  });

  // on text change: render the text while preserving undo stack
  createEffect(() => {
    editor.executeEdits(null, [
      {
        text: props.text,
        range: editor.getModel()?.getFullModelRange() as any,
      },
    ]);
    editor.pushUndoStop();
  });

  return <div ref={container!} class="w-full h-full"></div>;
};
