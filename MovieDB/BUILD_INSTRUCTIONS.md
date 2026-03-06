# MovieDB App — Step-by-Step Build Instructions

This guide walks you through building the **MovieDB** app from scratch using the `create-bdpa-react-scaffold` CLI.

---

## Prerequisites

- **Node.js** v18 or higher
- A free account at [The Movie Database (TMDB)](https://www.themoviedb.org/) and an API key/token
- A terminal

---

## Step 1: Scaffold the Project

Run the scaffold command and follow the prompts. When asked for a project name, enter `MovieDB`.

```bash
npx create-bdpa-react-scaffold@latest
```

Then enter the project directory:

```bash
cd MovieDB
```

Install dependencies:

```bash
npm install
```

---

## Step 2: Get a TMDB API Key

1. Go to [https://www.themoviedb.org/](https://www.themoviedb.org/)
2. Create an account
3. Go to **Settings → API**
4. Request an API key (select the **Developer** option)
5. Copy your API key

## Step 3: Create the Environment File

In the root of the `MovieDB` folder, create a `.env` file with your TMDB credentials:

```env
VITE_API_BASE_URL=https://api.themoviedb.org/3
VITE_API_MOVIEDB_TOKEN=your_tmdb_api_key_here
```

> Replace `your_tmdb_api_key_here` with the API key you copied in Step 2.

---

## Step 4: Update `vite.config.mts`

Confirm your `vite.config.mts` has the `@` alias pointing to `./src` and the dev server running on port 3000. Replace the file contents with:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
```

---

## Step 5: Create the API Client

Create the file `src/utils/api.js`. This wraps Axios with CRUD helpers and returns a consistent `{ success, data }` or `{ success, error }` shape.

```js
import axios from "axios";

export class ApiClient {
  constructor(baseURL = "") {
    this.instance = axios.create({
      baseURL,
      headers: { "Content-Type": "application/json" },
    });

    this.instance.interceptors.response.use(
      (res) => res,
      (err) => {
        const message = err?.response?.data?.message || err?.message || "Request failed";
        return Promise.reject(new Error(message));
      }
    );
  }

  setToken(token) {
    if (token) {
      this.instance.defaults.headers.common["Authorization"] = "Bearer " + token;
    } else {
      delete this.instance.defaults.headers.common["Authorization"];
    }
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

  async create(url, data, config = {}) {
    return this.request({ url, method: "POST", data, ...config });
  }

  async update(url, data, config = {}) {
    return this.request({ url, method: "PUT", data, ...config });
  }

  async patch(url, data, config = {}) {
    return this.request({ url, method: "PATCH", data, ...config });
  }

  async delete(url, config = {}) {
    return this.request({ url, method: "DELETE", ...config });
  }
}

export default new ApiClient(import.meta.env.VITE_API_BASE_URL || "");
```

> Key methods used by the movie pages:
> - `getAll(url, { params })` — fetch a list of movies
> - `getOne(url, { params })` — fetch a single movie by ID

---

## Step 6: Configure Routing in `main.jsx`

Replace `src/main.jsx` with the following to wrap the app in `<BrowserRouter>`:

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

---

## Step 7: Define Routes in `App.jsx`

Replace `src/App.jsx` with:

```jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "@/pages/nonauth/Home";
import MovieDetails from "@/pages/nonauth/MovieDetails";
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
      </Routes>
    </>
  );
}

export default App;
```

> Two routes are defined:
> - `/` — renders the Home page (popular movies grid)
> - `/MovieDetails/:movieId` — renders the details page for a specific movie

---

## Step 8: Build the Navbar Component

Create the file `src/components/layout/Navbar.jsx`:

```jsx
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "../ui/navigation-menu";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <NavigationMenu className="bg-gray-800 text-white p-4 w-full max-w-full">
      <NavigationMenuList className="flex w-full space-x-4">
        <NavigationMenuItem className="mr-auto">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-auto">
          <Link to="" className="hover:text-gray-300">
            Favorite
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="ml-8">
          <Link to="" className="hover:text-gray-300">
            Sign In
          </Link>
        </NavigationMenuItem>
        {/* Add more navigation items as needed */}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
```

> The Navbar uses shadcn/ui's `NavigationMenu` components and `react-router-dom`'s `Link`.

---

## Step 9: Build the Home Page

Create the folder `src/pages/nonauth/` if it does not exist, then create `src/pages/nonauth/Home.jsx`:

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

**What this page does:**
- On mount, calls `/movie/popular` from the TMDB API
- Renders a responsive 3-column grid of movie cards
- Each card shows the title, release date, poster image, and overview
- Each card has a "View Details" link that navigates to `/MovieDetails/:id`

---

## Step 10: Build the Movie Details Page

Create `src/pages/nonauth/MovieDetails.jsx`:

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
          <p><strong>Genres:</strong> {movie.genres?.map((genre) => genre.name).join(", ")}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
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
```

**What this page does:**
- Reads `:movieId` from the URL params using `useParams()`
- Calls `/movie/:movieId` from the TMDB API on mount
- Displays: poster, title, release date, overview, genres, and runtime
- Shows a "Loading..." placeholder until data arrives
- Has a "Back to Home" link in the card footer

---

## Step 11: Run the App

Start the development server:

```bash
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000).

You should see a grid of popular movies. Click **View Details** on any movie to navigate to its details page.

---

## File Summary

| Step | File | Purpose |
|------|------|---------|
| 3 | `.env` | TMDB API base URL and token |
| 4 | `vite.config.mts` | `@` alias + dev server port 3000 |
| 5 | `src/utils/api.js` | Axios-based API client with CRUD helpers |
| 6 | `src/main.jsx` | React entry point wrapped in `<BrowserRouter>` |
| 7 | `src/App.jsx` | Route definitions for `/` and `/MovieDetails/:movieId` |
| 8 | `src/components/layout/Navbar.jsx` | Top navigation bar with Home / Favorite / Sign In links |
| 9 | `src/pages/nonauth/Home.jsx` | Popular movies grid with card layout |
| 10 | `src/pages/nonauth/MovieDetails.jsx` | Individual movie detail view |

---

## Notes

- The scaffold already installs shadcn/ui components such as `Card`, `NavigationMenu`, and more. No separate `npx shadcn-ui add` commands are needed.
- The `@` path alias resolves to `src/` — use it for all imports (e.g., `@/utils/api`, `@/components/ui/card`).
- **Never commit your `.env` file.** Add it to `.gitignore` to keep your TMDB token private.
- The `bcryptjs` and `zod` packages are included in the scaffold for future auth features (Login / Register pages).
