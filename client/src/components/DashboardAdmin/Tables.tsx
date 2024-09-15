import { useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";
import { urlClient } from "../../config/axiosConfig";
import { encodeBase64 } from "../../utils/encodeDecode";

export const Tables = () => {
  const [tables, setTables] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      users: [`Usuario ${i + 1}A`, `Usuario ${i + 1}B`],
    }))
  );

  const removeUser = (tableId: number, userIndex: number) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? { ...table, users: table.users.filter((_, i) => i !== userIndex) }
          : table
      )
    );
  };

  const downloadQR = (tableId: number) => {
    const element = document.getElementById(`qr-table-${tableId}`);
    if (!element) return;
    html2canvas(element).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `mesa-${tableId}-qr.png`;
      link.click();
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Gestión de Mesas</h2>
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Mesa</th>
            <th className="border px-4 py-2">Usuarios</th>
            <th className="border px-4 py-2">Código QR</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id}>
              <td className="border px-4 py-2">Mesa {table.id}</td>
              <td className="border px-4 py-2">
                {table.users.map((user, userIndex) => (
                  <div
                    key={userIndex}
                    className="flex items-center justify-between mb-1"
                  >
                    <span>{user}</span>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeUser(table.id, userIndex)}
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </td>
              <td className="border px-4 py-2">
                <div className="flex items-center justify-center">
                  <div
                    id={`qr-table-${table.id}`}
                    className="flex flex-col items-center gap-2 justify-center w-32 h-32 rounded"
                  >
                    <span>Mesa {table.id}</span>
                    <QRCodeSVG
                      value={`${urlClient}${encodeBase64(table.id)}`}
                      size={64}
                    />
                  </div>
                  <FaDownload
                    className="h-4 w-4 text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => downloadQR(table.id)}
                    title="Descargar Código QR"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
