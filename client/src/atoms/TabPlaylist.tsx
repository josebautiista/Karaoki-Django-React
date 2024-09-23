interface TabProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
}

export const TabPlaylist: React.FC<TabProps> = ({
  label,
  onClick,
  isActive,
}) => (
  <button
    onClick={onClick}
    className={`w-full md:w-auto px-4 py-2 text-sm font-medium focus:outline-none rounded-t-md ${
      isActive ? "text-gray-900 bg-white" : "text-gray-100"
    }`}
  >
    {label}
  </button>
);
