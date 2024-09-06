import { useState, ChangeEvent, useContext, useEffect } from "react";
import { AppContext, AppContextType } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../config/axiosConfig";

export const LoginUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const { idMesa } = useContext(AppContext) as AppContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!idMesa) {
      navigate("/");
    }
  }, [idMesa, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const registerUser = () => {
    localStorage.setItem("name", name);
    navigate("/songs");
    try {
      api
        .post("/user/create/", { name, table_id: idMesa })
        .then((res) => {
          localStorage.setItem("nameKaraoki", name);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="w-full h-screen max-w-md m-auto p-6 bg-gray-100 flex flex-col items-center justify-center"
      onSubmit={registerUser}
    >
      <p className="text-xl mb-6 text-black font-bold">Ingresa tu nombre</p>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Jhon Doe"
        className="w-full h-20 px-4 text-xl text-center py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {name && <p className="mt-4 text-gray-700">Hola, {name}!</p>}
      <button
        type="submit"
        className="w-2/3 h-16 mt-6 bg-green-500 text-white font-bold text-2xl rounded-lg hover:bg-green-600 transition duration-300"
      >
        Ingresar
      </button>
    </form>
  );
};
