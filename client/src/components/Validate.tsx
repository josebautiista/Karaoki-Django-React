import { useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { QRScan } from "../pages/QRScan";
import { AppContext, AppContextType } from "../context/AppProvider";

export const Validate = () => {
  const { setIdMesa } = useContext(AppContext) as AppContextType;
  const { id } = useParams();
  const decodeBase64 = (str: string) => parseInt(atob(str), 10);

  useEffect(() => {
    console.log("id", id);
    if (id) {
      setIdMesa(Number(decodeBase64(id)));
    }
  }, [id, setIdMesa]);

  if (id) {
    return <Navigate to="/loginUser" />;
  } else {
    return <QRScan />;
  }
};
