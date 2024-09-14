import "./App.css";
import { QRScan } from "./pages/QRScan";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginUser } from "./pages/LoginUser";
import { Validate } from "./components/Validate";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import { Login } from "./auth/Login";
import { Registro } from "./auth/Registro";
import { Buscador } from "./pages/Buscador";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QRScan />} />
          <Route path="/loginUser" element={<LoginUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/:id?" element={<Validate />} />
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

export default App;
