import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "@/pages/nonauth/Home";
import MovieDetails from "@/pages/nonauth/MovieDetails";
function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/MovieDetails/:movieId" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;