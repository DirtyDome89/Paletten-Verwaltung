import { useEffect, useState } from 'react';
import { getPalettes } from '../services/api';

const Dashboard = () => {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    getPalettes().then(setPalettes);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Palettenverwaltung</h1>
      <ul>
        {palettes.map(palette => (
          <li key={palette._id}>{palette.name} - {palette.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
