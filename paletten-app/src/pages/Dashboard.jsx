import { useEffect, useState } from 'react';
import { getPalettes } from '../services/api';

const Dashboard = () => {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    getPalettes().then(setPalettes);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Palettenverwaltung</h1>
      {palettes.length === 0 ? (
        <p>Keine Paletten gefunden.</p>
      ) : (
        <ul className="space-y-2">
          {palettes.map(palette => (
            <li key={palette._id} className="p-2 border rounded shadow-sm">
              <strong>{palette.name}</strong> – {palette.quantity} Stück
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
