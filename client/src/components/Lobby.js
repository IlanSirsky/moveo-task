import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Lobby.css';
import io from 'socket.io-client';

// Connect to the server
// const socket = io('http://localhost:4000');
const socket = io('https://moveo-task-server-ruby.vercel.app', {
  cert: process.env.NODE_ENV === 'production' ? process.env.SSL_CERT : '',
  key: process.env.NODE_ENV === 'production' ? process.env.SSL_KEY : '',
  reconnection: true,
  reconnectionAttempts: 5,
});

// Lobby component
const Lobby = () => {
  const [titles, setTitles] = useState([]);

  // Get code block titles from the server
  useEffect(() => {
    const returnStatus = socket.emit('getTitles');
    console.log('Fetching code block titles', returnStatus);
    socket.on('titles', (titles) => {
      setTitles(titles);
    });
  }, []);

  return (
    <div>
      <h2>Choose Code Block</h2>
      <ul>
        {titles.map(block => (
          <li key={block.id}>
            <Link to={`/code/${block.id}`}>{block.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;