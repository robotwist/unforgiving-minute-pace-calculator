import React, { useState } from 'react';
import './index.css';
import { Routes, Route, Link } from 'react-router-dom';
import RunningTrainingApp from './components/RunningTrainingApp';
import RunningDesignApp from './RunningDesignApp';
import Coach from './pages/Coach';
import Thanks from './pages/Thanks';

function App() {
  const [currentView] = useState('calculator'); // Start with calculator as landing page - Build: 2025-08-11

  return (
    <div className="App">
      <nav className="px-4 py-3 border-b" style={{ borderColor: '#E2E8F0' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm">
          <Link to="/" className="underline">Home</Link>
          <Link to="/coach" className="underline">Coach</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={currentView === 'design' ? <RunningDesignApp /> : <RunningTrainingApp />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="*" element={<RunningTrainingApp />} />
      </Routes>
    </div>
  );
}

export default App; 