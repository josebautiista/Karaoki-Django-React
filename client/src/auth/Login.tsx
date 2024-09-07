import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiLock, CiUser } from "react-icons/ci";
import { api } from "../config/axiosConfig";
import { Input } from "../atoms/Input";

export const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("login/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.access);
      navigate("/");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("nameKaraoki");

    if (token) {
      navigate("/admin");
    } else if (name) {
      navigate("/songs");
    }
  }, [navigate]);

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50 px-5">
      <div className="w-full max-w-sm p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Username: "
            placeholder="Digite su username"
            Icon={CiUser}
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <Input
            label="Contraseña: "
            placeholder="Digite su contraseña"
            type="password"
            Icon={CiLock}
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};
