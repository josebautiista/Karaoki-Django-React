import { useContext, useEffect, useState } from "react";
import { ModalTable } from "../ModalTable";
import { api } from "../../config/axiosConfig";
import { AppContext, AppContextType } from "../../context/AppProvider";
import { Table } from "../../Types/VideoResponse";

//   id: i + 1,
//   maxSongs: 20,
//   isActive: true,
//   users: [
//     { id: 1, name: `User ${i * 2 + 1}` },
//     { id: 2, name: `User ${i * 2 + 2}` },
//   ],
//   songs: [
//     {
//       id: 1,
//       title: `Song ${i * 2 + 1}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//     {
//       id: 2,
//       title: `Song ${i * 2 + 2}`,
//       thumbnail: "http://example.com",
//       duration: "02:30",
//       url: "http://example.com",
//     },
//   ],
// }));
export const Configuration = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const { empresa } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (empresa?.id) {
      const fetchTables = async () => {
        try {
          const response = await api.get(`table/get/${empresa.id}`);
          setTables(response.data);
        } catch (error) {
          console.error("Error fetching tables:", error);
        }
      };

      fetchTables();
    }
  }, [empresa]);

  const handleOpenModal = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleUpdateTable = (data: { maxSongs: number; isActive: boolean }) => {
    console.log("Actualizar mesa:", selectedTable?.id, data);
  };

  const handleRemoveUser = (userId: number) => {
    console.log("Eliminar usuario:", userId);
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl text-left font-bold mb-4">Mesas</h2>
      <div className="flex flex-wrap gap-4 items-center justify-center w-full">
        {tables.map((table) => (
          <div
            key={table.id}
            className="p-4 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 flex flex-col items-center justify-center shadow-md h-48 w-48"
            onClick={() => handleOpenModal(table)}
          >
            <span className="text-lg font-semibold mb-2">Mesa {table.id}</span>
          </div>
        ))}
      </div>

      {selectedTable && (
        <ModalTable
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          tableId={selectedTable.id.toString()}
          users={selectedTable.users}
          maxSongs={selectedTable.max_songs}
          isActive={selectedTable.estado}
          songs={selectedTable.songs}
          onUpdate={handleUpdateTable}
          onRemoveUser={handleRemoveUser}
        />
      )}
    </div>
  );
};
