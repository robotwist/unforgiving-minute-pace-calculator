import React, { useState } from 'react';
import './index.css';
import RunningTrainingApp from './components/RunningTrainingApp';
import RunningDesignApp from './RunningDesignApp';

function App() {
  const [currentView] = useState('calculator'); // Start with calculator as landing page - Build: 2025-08-11

  return (
    <div className="App">
      {/* Main Content */}
      {currentView === 'design' ? (
        <RunningDesignApp />
      ) : (
        <RunningTrainingApp />
      )}
    </div>
  );
}

export default App; 