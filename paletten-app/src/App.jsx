import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Router>
      {/* Navigation */}
      <nav className="bg-gray-800 p-4 text-white">
        <Link to="/" className="mr-4 hover:text-gray-300">Dashboard</Link>
        <Link to="/settings" className="hover:text-gray-300">Einstellungen</Link>
      </nav>

      {/* Seiten */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/settings" element={<h1 className="p-8 text-2xl font-bold">Einstellungen</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
