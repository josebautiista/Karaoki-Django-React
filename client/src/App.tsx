import "./App.css";
import { QRScan } from "./pages/QRScan";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LoginUser } from "./pages/LoginUser";
import { Validate } from "./components/Validate";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import { Login } from "./auth/Login";
import { Registro } from "./auth/Registro";
import { Buscador } from "./pages/Buscador";
import { Player } from "./pages/Player";
import { useEffect } from "react";

function App() {
  const user = localStorage.getItem("user");

  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/loginUser" element={<LoginUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:id?/:empresa?" element={<Validate />} />
          <Route path="/songs" element={<Buscador />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/player"
            element={
              <ProtectedRoute>
                <Player />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registro"
            element={
              <ProtectedRoute>
                <Registro />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

interface HomeProps {
  user: string | null;
}
const Home = ({ user }: HomeProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/admin");
    }
  }, [user, navigate]);

  return user ? null : <QRScan />;
};

export default App;
