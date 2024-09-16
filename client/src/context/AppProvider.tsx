import React, { createContext, useState, ReactNode, useEffect } from "react";
import { decodeBase64 } from "../utils/encodeDecode";

export type AppContextType = {
  idMesa: number | null;
  setIdMesa: React.Dispatch<React.SetStateAction<number | null>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  empresa: Empresa | null;
  setEmpresa: React.Dispatch<React.SetStateAction<Empresa | null>>;
  empresaId: number | null;
  setEmpresaId: React.Dispatch<React.SetStateAction<number | null>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

interface User {
  id: number;
  username: string;
  email: string;
  estado: boolean;
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
