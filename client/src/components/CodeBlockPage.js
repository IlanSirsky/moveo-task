import '../styles/CodeBlockPage.css';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import CodeSnippet from './CodeSnippet';
import CodeEditor from './CodeEditor';

const CodeBlockPage = () => {
    let { id } = useParams();
    const navigate = useNavigate();

    const codeBlockId = parseInt(id, 10);

    const [role, setRole] = useState('');
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [solution, setSolution] = useState('');
    const [editableCode, setEditableCode] = useState('');
    const [solutionEqual, setSolutionEqual] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {

        socketRef.current = io('http://localhost:4000');

        socketRef.current.emit('joinCodeBlock', codeBlockId);

        socketRef.current.on('assignRole', (assignedRole) => {
            console.log(`You are the ${assignedRole}`);
            setRole(assignedRole); // 'mentor' or 'student'
        });

        socketRef.current.on('loadCode', ({ title, code, solution }) => {
            setTitle(title);
            setCode(code);
            setEditableCode(code);
            setSolution(solution);
        });

        socketRef.current.on('codeUpdated', (updatedCode) => {
            setCode(updatedCode);
        });

        // Clean up on component unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [codeBlockId]);

    const handleEditableCodeChange = (event) => {
        const changedCode = event.target.value;
        
        if (changedCode === solution) {
            setSolutionEqual(true);
        } else {
            setSolutionEqual(false);
        }
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
            <h2 className="title">{title} </h2>
            <div className="role">Your role: {role}</div>
            <div className="code-block">
            {role === 'student' && <CodeEditor value={editableCode} onChange={handleEditableCodeChange} />}
            <CodeSnippet code={code} />
            {solutionEqual && <div className='solution'>Your solution is correct😀👍</div>}
            </div>
        </div>
    );
};

export default CodeBlockPage;
