import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../atoms/Input";
import { CiUser, CiMail, CiLock } from "react-icons/ci";
import { Message } from "../atoms/Message";
import { api } from "../config/axiosConfig";

export const Registro = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlert(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [alert]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }
    setPasswordError("");
    try {
      await api
        .post("registro/", {
          username,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          estado: 1,
          empresa_id: 1,
        })
        .then((response) => {
          console.log(response);
          localStorage.setItem("token", response.data.access);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          setAlert(true);
        });
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center py-10 px-5 bg-gray-100">
      {alert && (
        <Message
          message="Hubo un error al registrar el usuario. Por favor, intenta de nuevo."
          type="error"
          onClose={() => setAlert(false)}
        />
      )}
      <div className="w-full max-w-xl p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Registro de Usuarios</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 mb-4">
            <Input
              label="Username: "
              placeholder="Jhon Doe"
              Icon={CiUser}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Email: "
              placeholder="jhon@doe.com"
              Icon={CiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Nombre: "
              placeholder="Jhon"
              Icon={CiUser}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Apellido: "
              placeholder="Doe"
              Icon={CiUser}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <Input
              label="Password: "
              placeholder="********"
              Icon={CiLock}
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
              required
            />
            <Input
              label="Confirm Password: "
              placeholder="********"
              Icon={CiLock}
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
              }}
              required
            />
            {passwordError && (
              <div className="col-span-1 md:col-span-2 text-red-500 text-sm mt-1">
                {passwordError}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-3"
          >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
};
