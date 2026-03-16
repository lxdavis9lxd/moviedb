import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "@/pages/nonauth/Home";
import MovieDetails from "@/pages/nonauth/MovieDetails";
import SearchMovies from "@/pages/nonauth/SearchMovies";
import Navbar from "@/components/layout/Navbar";
function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/MovieDetails/:movieId" element={<MovieDetails />} />
        <Route path="/search" element={<SearchMovies />} />
      </Routes>
    </>
  );
}

export default App;