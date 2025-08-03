import {BrowserRouter, Routes, Route} from "react-router-dom";
import LandingPage from "../src/Pages/Landing";
import RegisterPage from "../src/Pages/Register";
function App() {

  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
