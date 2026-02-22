import { Card,CardHeader,CardContent,CardTitle,CardFooter } from "@/components/ui/card";
import { ApiClient } from "@/utils/api";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);
  const { movieId } = useParams();

  const fetchMovieDetails = async (movieId) => {    
    const res = await apiClient.getOne(`/movie/${movieId}`, {
      params: { api_key: import.meta.env.VITE_API_MOVIEDB_TOKEN },
    });
    if (res.success) {
      setMovie(res.data);
    } else {
      console.error("Failed to fetch movie details:", res.error);
    }
  };

  useEffect(() => {
    if (movieId) {
      fetchMovieDetails(movieId);
    }
  }, [movieId]);

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-1 w-1/4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle >{movie.title}</CardTitle>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          ) }
        </CardHeader>
        <CardContent>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(genre => genre.name).join(", ")}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          {/* Add more movie details as needed */}
        </CardContent> 
        <CardFooter>
          <Link to="/" className="text-blue-500">
            Back to Home
          </Link>
        </CardFooter>         
      </Card>
    </div>      
    );  
}





export default MovieDetails;