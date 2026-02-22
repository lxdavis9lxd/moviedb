import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "@/pages/nonauth/Home";
function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;