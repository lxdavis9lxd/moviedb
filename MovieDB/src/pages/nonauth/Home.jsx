import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";
import { ApiClient } from "@/utils/api";
import { useEffect } from "react";
function Home() {
  const [movies, setMovies] = useState([]);
  const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL + "movie/");
  apiClient.setToken(import.meta.env.VITE_API_MOVIEDB_TOKEN);

  const fetchMovies = async () => {
    const res = await apiClient.getAll("/movies");
    if (res.success) {
      setMovies(res.data);
    } else {
      console.error("Failed to fetch movies:", res.error);
    }
  };

  useEffect(() => {fetchMovies();}, []);
    return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieDB</h1>
      <p className="mb-4">Discover and explore your favorite movies.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription>{movie.release_date}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{movie.overview}</p>
              <Link to={`/movies/${movie.id}`} className="text-blue-500 mt-2 inline-block">
                View Details
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );    
}

export default Home;