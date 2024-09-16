import { useState } from "react";
import { FaTrash } from "react-icons/fa6";

export const SongsQueue = () => {
  const [mainQueue, setMainQueue] = useState([
    "Canción 1",
    "Canción 2",
    "Canción 3",
    "Canción 4",
    "Canción 5",
  ]);
  const removeSong = (songIndex: number) => {
    setMainQueue(mainQueue.filter((_, i) => i !== songIndex));
  };
  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Cola Principal de Canciones</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Canción</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mainQueue.map((song, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{song}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeSong(index)}
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
