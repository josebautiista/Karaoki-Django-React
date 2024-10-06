import React, { useContext, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { CardVideo } from "../atoms/CardVideo";
import { User, Video } from "../Types/VideoResponse";
import { AppContext, AppContextType } from "../context/AppProvider";
import { FaDownload } from "react-icons/fa6";
import html2canvas from "html2canvas";
import { encodeBase64 } from "../utils/encodeDecode";
import { MdDelete } from "react-icons/md";

interface TableConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  users: User[];
  maxSongs: number;
  isActive: boolean;
  songs: Video[];
  onUpdate: (data: { max_songs: number; isActive: boolean }) => void;
  onRemoveUser: (userId: number) => void;
}

export const ModalTable: React.FC<TableConfigModalProps> = ({
  isOpen,
  onClose,
  tableId,
  users,
  maxSongs,
  isActive,
  songs,
  onUpdate,
  onRemoveUser,
}) => {
  const [currentMaxSongs, setCurrentMaxSongs] = useState<number | string>(
    maxSongs
  );
  const [currentIsActive, setCurrentIsActive] = useState(isActive);
  const { empresa, setRevalidate } = useContext(AppContext) as AppContextType;
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const handleMaxSongsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setCurrentMaxSongs(value === "" ? "" : Number(value));
    }
  };

  const handleToggleActive = () => {
    setCurrentIsActive((prev) => !prev);
  };

  const handleSaveChanges = () => {
    const maxSongsToUpdate =
      currentMaxSongs === "" ? maxSongs : Number(currentMaxSongs);
    onUpdate({ max_songs: maxSongsToUpdate, isActive: currentIsActive });
    onClose();
  };

  const handleDeleteUser = (userId: number) => {
    setRevalidate((x) => !x);
    setUserToDelete(userId);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete !== null) {
      onRemoveUser(userToDelete);
      setUserToDelete(null);
      setShowConfirmDelete(false);
      users.splice(userToDelete, 1);
    }
  };

  const downloadQR = (tableId: string) => {
    const element = document.getElementById(`qrtable-${tableId}`);
    if (!element) return;
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `mesa-${tableId}-qr.png`;
      link.click();
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-2">
              Confirmar Eliminación
            </h3>
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col md:flex-row relative max-h-[90vh] mx-5">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          >
            &times;
          </button>
          <div className="w-full md:w-1/2 flex-1 md:pr-4 mb-4 md:mb-0">
            <h2 className="text-xl font-semibold mb-2">
              Configuración de la Mesa {tableId}
            </h2>

            <div className="mb-4" id={`qrtable-${tableId}`}>
              <h3 className="text-lg font-semibold mb-2">
                QR para la Mesa {tableId}
              </h3>
              <div className="flex justify-center py-2">
                <QRCodeSVG
                  value={`${import.meta.env.VITE_URL_CLIENT}${encodeBase64(
                    tableId
                  )}/${encodeBase64(empresa?.id)}`}
                  size={200}
                />
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <FaDownload
                className="h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer"
                onClick={() => downloadQR(tableId)}
                title="Descargar Código QR"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Máximo de canciones
              </label>
              <input
                type="number"
                value={currentMaxSongs}
                onChange={handleMaxSongsChange}
                className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3"
              />
            </div>

            <div className="flex items-center mb-4">
              <label className="text-sm font-medium text-gray-700 mr-2">
                Mesa activa
              </label>
              <input
                type="checkbox"
                checked={currentIsActive}
                onChange={handleToggleActive}
                className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Usuarios Registrados
              </h3>
              <div className="max-h-[300px] overflow-y-auto">
                <ul className="list-disc list-inside flex flex-col gap-2">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center"
                    >
                      {user.name}
                      <MdDelete
                        className="text-red-500 hover:text-red-700 cursor-pointer text-lg"
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
              >
                Guardar
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex-1 md:pl-4 border-l border-gray-200 overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Playlist</h3>
            <div className="flex flex-col space-y-4">
              {songs.map((song, i) => (
                <CardVideo key={i} video={song} env="admin" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
