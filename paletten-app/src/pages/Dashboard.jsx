// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { getPalettes } from '../services/api';

const Dashboard = () => {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    // API-Abfrage: Hole die Paletten
    getPalettes().then((data) => {
      setPalettes(data);
    }).catch((error) => {
      console.error("Fehler beim Laden der Paletten:", error);
    });
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Palettenverwaltung</h1>
      {palettes.length === 0 ? (
        <p>Keine Paletten gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {palettes.map(palette => (
            <li key={palette._id} className="p-2 border rounded shadow-sm">
              <strong>{palette.name}</strong> – {palette.quantity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
