// src/App.jsx
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      <nav className="bg-gray-100 p-4">
        <Link to="/" className="mr-4 text-blue-600">Dashboard</Link>
        {/* Hier kannst du weitere Links hinzufügen */}
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* Weitere Routen kannst du hier einfügen */}
      </Routes>
    </Router>
  );
};

export default App;
