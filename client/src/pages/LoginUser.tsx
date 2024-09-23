import { useState, ChangeEvent, useContext, useEffect } from "react";
import { AppContext, AppContextType } from "../context/AppProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../config/axiosConfig";

export const LoginUser: React.FC = () => {
  const [name, setName] = useState<string>("");
  const { idMesa, empresaId, setUser } = useContext(
    AppContext
  ) as AppContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!idMesa) {
      navigate("/");
    }
  }, [idMesa, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const registerUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      api
        .post("/user/create/", {
          name,
          table_id: idMesa,
          empresa_id: empresaId,
        })
        .then((response) => {
          localStorage.setItem("nameKaraoki", name);
          setUser(response.data.user);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/songs");
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
      className="w-full h-screen max-w-md m-auto p-6 flex flex-col items-center justify-center"
      onSubmit={registerUser}
    >
      <p className="text-xl mb-6 text-white font-bold">Ingresa tu nombre</p>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        placeholder="Jhon Doe"
        className="w-full h-20 px-4 text-xl text-center py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
      />
      {name && <p className="mt-4 text-gray-200">Hola, {name}!</p>}
      <button
        type="submit"
        className="w-2/3 h-16 mt-6 bg-red-500 text-white font-bold text-2xl rounded-lg hover:bg-red-600 transition duration-300"
      >
        Ingresar
      </button>
    </form>
  );
};
