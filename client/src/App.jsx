import {BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "../src/Pages/Landing";
import RegisterPage from "../src/Pages/Register";
import LoginPage from "../src/Pages/Login";
function App() {

  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
