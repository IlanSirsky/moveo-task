import React , { useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import '../styles/Lobby.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const Lobby = () => {
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    socket.emit('getTitles');
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