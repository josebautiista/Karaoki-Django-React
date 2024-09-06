import "./App.css";
import { QRScan } from "./pages/QRScan";
import { AppProvider } from "./context/AppProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginUser } from "./pages/LoginUser";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QRScan />} />
          <Route path="/loginUser" element={<LoginUser />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
