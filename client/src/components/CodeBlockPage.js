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
    const [editableCode, setEditableCode] = useState(codeBlock.code);
    const codeRef = useRef(null);
    const socketRef = useRef(null);


    useEffect(() => {

        socketRef.current = io('http://localhost:4000');

        socketRef.current.emit('joinCodeBlock', codeBlockId);

        socketRef.current.on('assignRole', (assignedRole) => {
            console.log(`You are the ${assignedRole}`);
            setRole(assignedRole); // 'mentor' or 'student'
        });

        socketRef.current.on('loadCode', (initialCode) => {
            setCode(initialCode);
            setEditableCode(initialCode);
        });

        socketRef.current.on('codeUpdated', (updatedCode) => {
            console.log('Code updated:', updatedCode);
            setCode(updatedCode);
        });

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [codeBlockId]);

    useEffect(() => {
        if (codeRef.current) {
            // Update the text content of the codeRef
            codeRef.current.textContent = code;
            // Re-highlight the code
            hljs.highlightBlock(codeRef.current);
        }
    }, [code]);

    if (!codeBlock) {
        return <div>Code block not found</div>;
    }

    const handleEditableCodeChange = (event) => {
        const changedCode = event.target.value;
        setEditableCode(changedCode);
        if (socketRef.current) {
            socketRef.current.emit('updateCode', { codeBlockId, updatedCode: changedCode });
        }
    };

    const handleBackToLobby = () => {
        navigate('/');
    };

    return (
        <div className="container">
            <button className="back-button" onClick={handleBackToLobby}>Back to Lobby</button>
            <h2 className="title">{codeBlock.title}</h2>
            <div className="role">Your role: {role}</div>
            <div className="code-block">
                {role === 'student' &&
                    <div>
                        <textarea
                            value={editableCode}
                            onChange={handleEditableCodeChange}
                            spellCheck="false"
                            rows="10"
                            cols="100"
                        />
                    </div>}
                <pre>
                    <code className="language-javascript" spellcheck="false" ref={codeRef}> {code} </code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlockPage;
