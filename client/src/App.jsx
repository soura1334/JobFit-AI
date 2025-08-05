import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LandingPage from "../src/Pages/Landing";
import RegisterPage from "../src/Pages/Register";
import LoginPage from "../src/Pages/Login";
import DashboardPage from "./Pages/Dashboard";
import { AuthProvider } from "./Context/AuthContext";
import Contact from "./Pages/Contact";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contact" element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
