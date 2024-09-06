import { Dispatch, SetStateAction } from "react";
import { TabNames } from "../Types/TabNames";

type TabProps = {
  active: boolean;
  setActiveTab: Dispatch<SetStateAction<TabNames>>;
  title: TabNames;
};

export const Tab: React.FC<TabProps> = ({ active, setActiveTab, title }) => {
  return (
    <button
      className={`py-2 px-4 min-w-max rounded-md ${
        active ? "bg-white shadow font-semibold" : "text-gray-500"
      }`}
      onClick={() => setActiveTab(title)}
    >
      {title}
    </button>
  );
};
