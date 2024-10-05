import { useContext, useEffect, useState } from "react";
import { Table } from "../Types/VideoResponse";
import { AppContext, AppContextType } from "../context/AppProvider";
import { api } from "../config/axiosConfig";
import { ModalTable } from "./ModalTable";

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
  }, [empresa, selectedTable]);

  const handleOpenModal = (table: Table) => {
    setSelectedTable(table);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTable(null);
  };

  const handleUpdateTable = (data: {
    max_songs: number;
    isActive: boolean;
  }) => {
    if (!selectedTable) return;

    api
      .put(`table/update/${selectedTable.id}/`, data)
      .then((response) => {
        const updatedTable = { ...selectedTable, ...response.data };
        setSelectedTable(updatedTable);
        setTables((prevTables) =>
          prevTables.map((table) =>
            table.id === updatedTable.id ? updatedTable : table
          )
        );
      })
      .catch((error) => {
        console.error("Error updating table:", error);
      });
  };

  const handleRemoveUser = (userId: number) => {
    api
      .delete(`user/delete/${userId}/`)
      .then(() => {
        if (selectedTable) {
          const updatedUsers = selectedTable.users.filter(
            (user) => user.id !== userId
          );
          setSelectedTable({
            ...selectedTable,
            users: updatedUsers,
          });
          setTables((prevTables) =>
            prevTables.map((table) =>
              table.id === selectedTable.id
                ? { ...table, users: updatedUsers }
                : table
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
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
