import '../styles/CodeBlockPage.css';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import hljs from 'highlight.js';
import 'highlight.js/styles/night-owl.css';

// Mock data for code blocks
const codeBlocks = [
    { id: 1, title: 'Async Case', code: 'async function getData() {\n  // code\n}' },
    { id: 2, title: 'Callback Example', code: 'function fetchData(callback) {\n  // code\n}' },
    { id: 3, title: 'Promise Example', code: 'const promise = new Promise((resolve, reject) => {\n  // code\n});' },
    { id: 4, title: 'Async/Await Example', code: 'async function fetchData() {\n  const data = await getData();\n  return data;\n}' },
];


const CodeBlockPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();
    
    const codeBlockId = parseInt(id, 10);
    const codeBlock = codeBlocks.find(block => block.id === codeBlockId);

    const [role, setRole] = useState('');
    const [code, setCode] = useState(codeBlock.code);
    const codeRef = useRef(code);

    useEffect(() => {
        const socket = io('http://localhost:4000');

        socket.emit('joinCodeBlock', codeBlockId);

        socket.on('assignRole', (assignedRole) => {
            console.log(`You are the ${assignedRole}`);
            setRole(assignedRole); // 'mentor' or 'student'
        });

        // socket.on('codeUpdated', (updatedCode) => {
        //     setCode(updatedCode);
        // });

        return () => {
            socket.disconnect();
        };
    }, [codeBlockId]);

    useEffect(() => {
        if (codeRef.current) {
          hljs.highlightBlock(codeRef.current);
        }
      }, [code]);

    // const handleCodeChange = (event) => {
    //     const updatedCode = event.currentTarget.innerText;
    //     setCode(updatedCode);
    //     // socket.emit('updateCode', { codeBlockId, updatedCode });
    //     };

    if (!codeBlock) {
        return <div>Code block not found</div>;
    }

    const handleBackToLobby = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <button className="back-button" onClick={handleBackToLobby}>Back to Lobby</button>
            <h2 className="title">{codeBlock.title}</h2>
            <div className="role">Your role: {role}</div>
            <div className="code-block">
                <pre>
                    <code
                        className="language-javascript"
                        contentEditable={role === 'student'}
                        ref={codeRef}
                        
                        suppressContentEditableWarning={true}
                    >
                        {code}
                    </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlockPage;
