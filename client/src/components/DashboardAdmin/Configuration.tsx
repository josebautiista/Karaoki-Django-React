import { useState } from "react";

export const Configuration = () => {
  const [numTables, setNumTables] = useState(5);
  const [maxSongsPerTable, setMaxSongsPerTable] = useState(10);

  const handleNumTablesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setNumTables(value);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-4">
      <h2 className="text-xl text-left font-bold">Configuración General</h2>
      <div className="flex items-center space-x-4">
        <label htmlFor="numTables">Número de mesas:</label>
        <input
          id="numTables"
          type="number"
          value={numTables}
          onChange={handleNumTablesChange}
          min={1}
          className="w-24 border p-2"
        />
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="maxSongs">Máximo de canciones por mesa:</label>
        <input
          id="maxSongs"
          type="number"
          value={maxSongsPerTable}
          onChange={(e) => setMaxSongsPerTable(parseInt(e.target.value))}
          min={1}
          className="w-24 border p-2"
        />
      </div>
    </div>
  );
};
