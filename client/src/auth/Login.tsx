import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CiLock, CiUser } from "react-icons/ci";
import { api } from "../config/axiosConfig";
import { Input } from "../atoms/Input";
import { check } from "./check";

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
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          estado: response.data.estado,
        })
      );

      localStorage.setItem("empresa", JSON.stringify(response.data.empresa));
      window.location.href = "/admin";
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("nameKaraoki");

      if (token) {
        try {
          const response = await check();
          if (!response) {
            localStorage.removeItem("token");
          } else {
            navigate("/admin");
          }
        } catch (error) {
          console.error(
            "Token inválido o expirado, permaneciendo en login:",
            error
          );
          localStorage.removeItem("token");
        }
      } else if (name) {
        navigate("/songs");
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen px-5">
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
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};
