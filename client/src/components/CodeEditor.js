import React from "react";

// CodeEditor component
const CodeEditor = ({ value, onChange }) => {
    return (
      <textarea
        value={value}
        onChange={onChange}
        spellCheck="false"
        rows="10"
        cols="100"
      />
    );
  };

export default CodeEditor;