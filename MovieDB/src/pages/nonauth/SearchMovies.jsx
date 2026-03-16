import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ApiClient } from "@/utils/api";

function SearchMovies() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setMovies([]);
      setError("Please enter a movie title.");
      return;
    }

    setLoading(true);
    setError("");

    const res = await apiClient.getAll("/search/movie", {
      params: {
        api_key: import.meta.env.VITE_API_MOVIEDB_TOKEN,
        query: trimmedQuery,
      },
    });

    if (res.success) {
      setMovies(res.data?.results ?? []);
    } else {
      setMovies([]);
      setError("Unable to search movies right now.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col p-4 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Search Movies</h1>
      <p className="mb-6 text-gray-600">Find movies by title using MovieDB.</p>

      <form onSubmit={handleSearch} className="mb-6 space-y-2">
        <Label htmlFor="movie-search">Movie title</Label>
        <div className="flex gap-2">
          <Input
            id="movie-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Inception"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error ? <p className="text-red-600 mb-4">{error}</p> : null}

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <Card key={movie.id}>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>{movie.release_date || "Release date unknown"}</CardDescription>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto mt-2 rounded"
                  />
                ) : null}
              </CardHeader>
              <CardContent>
                <p className="line-clamp-4">{movie.overview || "No overview available."}</p>
                <Link to={`/MovieDetails/${movie.id}`} className="text-blue-500 mt-2 inline-block">
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default SearchMovies;