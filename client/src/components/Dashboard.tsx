import { AiOutlineLogout } from "react-icons/ai";
import { Configuration } from "./Configuration";
import { useNavigate } from "react-router-dom";
import { IoIosPlayCircle } from "react-icons/io";

export default function Dashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("empresa");
    navigate("/login");
  };

  const handleReproductor = () => {
    navigate("/player");
  };
  return (
    <>
      <div className="flex justify-end p-4 bg-red-700">
        <button
          className="p-2 text-white rounded flex items-center justify-center gap-1 ml-4"
          onClick={handleReproductor}
        >
          Reproductor <IoIosPlayCircle size={20} />
        </button>
        <button
          className="p-2 text-white rounded flex items-center justify-center gap-1"
          onClick={handleLogout}
        >
          Logout <AiOutlineLogout size={20} />
        </button>
      </div>
      <div className="container mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Panel de Administrador
        </h1>

        <Configuration />
      </div>
    </>
  );
}
