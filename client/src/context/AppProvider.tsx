import React, { createContext, useState, ReactNode, useEffect } from "react";
import { decodeBase64 } from "../utils/encodeDecode";
import { User } from "../Types/VideoResponse";

export type AppContextType = {
  idMesa: number | null;
  setIdMesa: React.Dispatch<React.SetStateAction<number | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  empresa: Empresa | null;
  setEmpresa: React.Dispatch<React.SetStateAction<Empresa | null>>;
  empresaId: number | null;
  setEmpresaId: React.Dispatch<React.SetStateAction<number | null>>;
  maxFetch: number;
  setMaxFetch: React.Dispatch<React.SetStateAction<number>>;
  revalidate: boolean;
  setRevalidate: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

interface Empresa {
  id: number;
  name: string;
  tables_number: number;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [idMesa, setIdMesa] = useState<number | null>(null);
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [maxFetch, setMaxFetch] = useState<number>(0);
  const [revalidate, setRevalidate] = useState<boolean>(false);
  const interval = 60000;

  useEffect(() => {
    const toggleRevalidate = () => {
      setRevalidate((x) => !x);
    };

    const intervalId = setInterval(toggleRevalidate, interval);

    return () => clearInterval(intervalId);
  }, [revalidate]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedEmpresa = localStorage.getItem("empresa");
    const idMesa = decodeBase64(localStorage.getItem("idMesa"));
    const empresaId = decodeBase64(localStorage.getItem("empresaId"));

    if (idMesa) {
      setIdMesa(Number(idMesa));
    }
    if (empresaId) {
      setEmpresaId(Number(empresaId));
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    if (storedEmpresa) {
      try {
        setEmpresa(JSON.parse(storedEmpresa));
      } catch (error) {
        console.error("Error parsing stored empresa:", error);
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        idMesa,
        setIdMesa,
        user,
        setUser,
        empresa,
        setEmpresa,
        empresaId,
        setEmpresaId,
        maxFetch,
        setMaxFetch,
        revalidate,
        setRevalidate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
