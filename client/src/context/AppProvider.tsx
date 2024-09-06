import React, { createContext, useState, ReactNode } from "react";

export type AppContextType = {
  idMesa: number | null;
  setIdMesa: React.Dispatch<React.SetStateAction<number | null>>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [idMesa, setIdMesa] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ idMesa, setIdMesa }}>
      {children}
    </AppContext.Provider>
  );
};
