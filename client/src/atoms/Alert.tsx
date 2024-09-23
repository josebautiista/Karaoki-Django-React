export const Alert: React.FC<{
  message: string;
  type: "success" | "error";
}> = ({ message, type }) => {
  const alertStyles =
    type === "success"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg shadow-md ${alertStyles}`}
      role="alert"
    >
      <span>{message}</span>
    </div>
  );
};
