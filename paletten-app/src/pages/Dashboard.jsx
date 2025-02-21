import { useEffect, useState } from 'react';
import { getPalettes } from '../services/api';

const Dashboard = () => {
  const [palettes, setPalettes] = useState([]);

  useEffect(() => {
    getPalettes()
      .then(setPalettes)
      .catch((error) => console.error("Fehler beim Laden der Paletten:", error));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Palettenverwaltung</h1>
      {palettes.length === 0 ? (
        <p>Keine Paletten gefunden.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 border-r">Name</th>
              <th className="py-2 px-4 border-r">Typ</th>
              <th className="py-2 px-4 border-r">Menge</th>
              <th className="py-2 px-4">Standort</th>
            </tr>
          </thead>
          <tbody>
            {palettes.map((palette) => (
              <tr key={palette._id} className="border-b">
                <td className="py-2 px-4 border-r">{palette.name}</td>
                <td className="py-2 px-4 border-r">{palette.type}</td>
                <td className="py-2 px-4 border-r">{palette.quantity}</td>
                <td className="py-2 px-4">{palette.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
