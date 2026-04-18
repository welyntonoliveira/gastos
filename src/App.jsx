import './App.css'; // Vamos estilizar depois
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Timeline from './pages/Timeline';
import Marcou from './pages/Marcou';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div className="app-container">
          <Marcou />
        </div>
      } />
      <Route path="/timeline" element={<Timeline />} />
    </Routes>
  );
}

export default AppWrapper;