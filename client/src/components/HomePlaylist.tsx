import React, { useContext, useState } from "react";
import { TabPlaylist } from "../atoms/TabPlaylist";
import { AppContext, AppContextType } from "../context/AppProvider";
import { Playlist } from "./Playlist";

export const HomePlaylist: React.FC = () => {
  const { empresaId, idMesa, user } = useContext(AppContext) as AppContextType;
  const [activeTab, setActiveTab] = useState<"personal" | "table" | "karaoke">(
    "personal"
  );

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          user?.id &&
          empresaId &&
          idMesa && (
            <Playlist idUser={user.id} idMesa={idMesa} empresaId={empresaId} />
          )
        );
      case "table":
        return (
          empresaId &&
          idMesa && <Playlist idMesa={idMesa} empresaId={empresaId} />
        );
      case "karaoke":
        return empresaId && <Playlist empresaId={empresaId} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <div className="flex flex-col md:flex-row justify-around border-b">
        <TabPlaylist
          label="Canciones Personales"
          onClick={() => setActiveTab("personal")}
          isActive={activeTab === "personal"}
        />
        <TabPlaylist
          label="Canciones de la Mesa"
          onClick={() => setActiveTab("table")}
          isActive={activeTab === "table"}
        />
        <TabPlaylist
          label="Canciones del Karaoke"
          onClick={() => setActiveTab("karaoke")}
          isActive={activeTab === "karaoke"}
        />
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-md text-gray-800">
        {renderContent()}
      </div>
    </div>
  );
};
