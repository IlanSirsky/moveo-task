import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Lobby.css';

// Mock data for code blocks
const codeBlocks = [
  { id: 1, title: 'Async Case' },
  { id: 2, title: 'Callback Example' },
  { id: 3, title: 'Promise Example' },
  { id: 4, title: 'Async/Await Example' },
];

const Lobby = () => {
  return (
    <div>
      <h2>Choose Code Block</h2>
      <ul>
        {codeBlocks.map(block => (
          <li key={block.id}>
            <Link to={`/code/${block.id}`}>{block.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Lobby;