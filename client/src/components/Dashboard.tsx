import { useState } from "react";
import { Tab } from "../atoms/Tab";
import { TabNames } from "../Types/TabNames";
import { Configuration } from "./DashboardAdmin/Configuration";
import { Tables } from "./DashboardAdmin/Tables";
import { SongsQueue } from "./DashboardAdmin/SongsQueue";

export default function Component() {
  const [activeTab, setActiveTab] = useState<TabNames>(TabNames.CONFIGURATION);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administrador</h1>

      <div className="flex space-x-4 bg-gray-100 rounded-md p-2 overflow-auto">
        {Object.values(TabNames).map((tabName) => (
          <Tab
            key={tabName}
            active={activeTab === tabName}
            setActiveTab={setActiveTab}
            title={tabName}
          />
        ))}
      </div>

      {activeTab === TabNames.CONFIGURATION && <Configuration />}

      {activeTab === TabNames.TABLES && <Tables />}

      {activeTab === TabNames.SONGS_QUEUE && <SongsQueue />}
    </div>
  );
}
