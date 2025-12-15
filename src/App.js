import React, { useEffect } from 'react';
import './index.css';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import RunningTrainingApp from './components/RunningTrainingApp';
import Coach from './pages/Coach';
import Thanks from './pages/Thanks';
import Apply from './pages/Apply';
import ApplyThanks from './pages/ApplyThanks';
import PRCalculator from './pages/PRCalculator';

function App() {
  const location = useLocation();

  // Keep dark mode consistent across routes (Coach/Thanks) and refreshes
  useEffect(() => {
    const isDark = localStorage.getItem('dark_mode_enabled') === 'true';
    document.body.classList.toggle('dark', isDark);
  }, [location.pathname]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'dark_mode_enabled') {
        document.body.classList.toggle('dark', e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="App">
      {/* Avoid duplicate nav on the in-app home experience */}
      {location.pathname !== '/' && (
        <nav className="px-4 py-3 um-app-header">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-sm">
            <Link to="/" className="munich-btn munich-btn-outline" style={{ padding: '0.5rem 0.75rem' }}>Home</Link>
            <Link to="/calculator" className="munich-btn munich-btn-outline" style={{ padding: '0.5rem 0.75rem' }}>Optimal Progress Pace</Link>
            <Link to="/calculator/pr" className="munich-btn munich-btn-outline" style={{ padding: '0.5rem 0.75rem' }}>PR Calculator</Link>
            <Link to="/apply" className="munich-btn munich-btn-primary" style={{ padding: '0.5rem 0.75rem' }}>Apply</Link>
            <Link to="/coach" className="munich-btn munich-btn-outline" style={{ padding: '0.5rem 0.75rem' }}>About</Link>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<RunningTrainingApp />} />
        <Route path="/calculator" element={<RunningTrainingApp />} />
        <Route path="/calculator/pr" element={<PRCalculator />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/thanks" element={<ApplyThanks />} />
        <Route path="/thanks" element={<Thanks />} />
        <Route path="*" element={<RunningTrainingApp />} />
      </Routes>
    </div>
  );
}

export default App; 