# How to Build the Movie Pages

## Prerequisites

- Project scaffold in place (Vite + React)
- Tailwind CSS configured
- shadcn/ui components installed (`card`, `badge`, etc.)
- React Router DOM installed
- `.env` file in the project root with:

```env
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_MOVIEDB_TOKEN=your_tmdb_api_key_here
```

---

## Step 1: Create the API Client

Create `src/utils/api.js`. This wraps axios with CRUD helpers and returns a consistent `{ success, data }` or `{ success, error }` shape.

```js
import axios from "axios";

export class ApiClient {
  constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });
  }

  async request(config) {
    try {
      const res = await this.instance.request(config);
      return { success: true, data: res.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getAll(url, config = {}) {
    return this.request({ url, method: "GET", ...config });
  }

  async getOne(url, config = {}) {
    return this.request({ url, method: "GET", ...config });
  }
}

export default new ApiClient(import.meta.env.VITE_API_BASE_URL || "");
```

> Key methods used by the movie pages:
> - `getAll(url, { params })` — fetch a list of movies
> - `getOne(url, { params })` — fetch a single movie by ID

---

## Step 2: Configure Routing

Update `src/main.jsx` to wrap the app in `<BrowserRouter>`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

Update `src/App.jsx` to define the routes:

```jsx
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/nonauth/Home";
import MovieDetails from "@/pages/nonauth/MovieDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/MovieDetails/:movieId" element={<MovieDetails />} />
    </Routes>
  );
}

export default App;
```

> The `:movieId` param is extracted in `MovieDetails` via `useParams()`.

---

## Step 3: Build the Home Page

Create `src/pages/nonauth/Home.jsx`.

**What it does:**
- On mount, calls `/movie/popular` from the TMDB API
- Renders a responsive grid of movie cards
- Each card links to the details page via `/MovieDetails/:id`

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ApiClient } from "@/utils/api";

function Home() {
  const [movies, setMovies] = useState([]);
  const apiClient = new ApiClient(import.meta.env.VITE_API_BASE_URL);

  const fetchMovies = async () => {
    const res = await apiClient.getAll("/movie/popular", {
      params: { api_key: import.meta.env.VITE_API_MOVIEDB_TOKEN },
    });
    if (res.success) {
      setMovies(res.data.results ?? res.data);
    } else {
      console.error("Failed to fetch movies:", res.error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="flex flex-col p-1 w-1/2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to MovieDB</h1>
      <p className="mb-4">Discover and explore your favorite movies.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {movies.map((movie) => (
          <Card key={movie.id}>
            <CardHeader>
              <CardTitle>{movie.title}</CardTitle>
              <CardDescription>{movie.release_date}</CardDescription>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-auto mt-2 rounded"
              />
            </CardHeader>
            <CardContent>
              <p>{movie.overview}</p>
              <Link to={`/MovieDetails/${movie.id}`} className="text-blue-500 mt-2 inline-block">
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
```

---

## Step 4: Build the Movie Details Page

Create `src/pages/nonauth/MovieDetails.jsx`.

**What it does:**
- Reads `:movieId` from the URL params
- Calls `/movie/:movieId` from the TMDB API
- Displays full movie info: poster, genres, runtime, overview
- Provides a "Back to Home" link

```jsx
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "@/components/ui/card";
import { ApiClient } from "@/utils/api";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

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
    if (movieId) fetchMovieDetails(movieId);
  }, [movieId]);

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center p-1 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{movie.title}</CardTitle>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
          )}
        </CardHeader>
        <CardContent>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres?.map((g) => g.name).join(", ")}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
        </CardContent>
        <CardFooter>
          <Link to="/" className="text-blue-500">Back to Home</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default MovieDetails;
```

---

## Step 5: Run the App

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser.

---

## Summary

| Step | File | Purpose |
|------|------|---------|
| 1 | `src/utils/api.js` | Axios-based API client |
| 2 | `src/main.jsx` + `src/App.jsx` | BrowserRouter + route definitions |
| 3 | `src/pages/nonauth/Home.jsx` | Popular movies grid |
| 4 | `src/pages/nonauth/MovieDetails.jsx` | Single movie detail view |
| 5 | — | Run with `npm run dev` |
