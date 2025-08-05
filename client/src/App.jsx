import {BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "../src/Pages/Landing";
import RegisterPage from "../src/Pages/Register";
import LoginPage from "../src/Pages/Login";
import DashboardPage from "./Pages/Dashboard";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
