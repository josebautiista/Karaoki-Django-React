import { useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";
import { QRScan } from "../pages/QRScan";
import { AppContext, AppContextType } from "../context/AppProvider";
import { decodeBase64 } from "../utils/encodeDecode";

export const Validate = () => {
  const { setIdMesa, setEmpresaId } = useContext(AppContext) as AppContextType;
  const { id, empresa } = useParams();

  useEffect(() => {
    if (id) {
      localStorage.setItem("idMesa", id);
      localStorage.setItem("empresaId", empresa!);
      setIdMesa(Number(decodeBase64(id)));
      setEmpresaId(Number(decodeBase64(empresa!)));
    }
  }, [id, setIdMesa, setEmpresaId, empresa]);

  if (id) {
    return <Navigate to="/loginUser" />;
  } else {
    return <QRScan />;
  }
};
