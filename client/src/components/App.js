import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Lobby from './Lobby';
import CodeBlockPage from './CodeBlockPage';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/code/:id" element={<CodeBlockPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;