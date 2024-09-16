import React from "react";

interface MessageProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  onClose?: () => void;
}

export const Message: React.FC<MessageProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800";
      case "error":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div
      className={`absolute bottom-1 z-50 p-4 mb-4 rounded-md ${getTypeClasses()} border border-transparent`}
    >
      <div className="flex items-center justify-between">
        <p>{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-lg font-semibold">
            &times;
          </button>
        )}
      </div>
    </div>
  );
};
