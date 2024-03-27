import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

const CodeSnippet = ({ code }) => {
  const codeRef = useRef();

  useEffect(() => {
    hljs.highlightBlock(codeRef.current);
  }, [code]);

  return (
    <pre>
      <code spellCheck="false" ref={codeRef} className="javascript">
        {code} 
      </code>
    </pre>
  );
};

export default CodeSnippet;
