import { createContext, useContext } from "react";
import useMovies from "../hooks/useMovies";

// Loads movie + theatre data once when the app starts and shares it everywhere
const MoviesContext = createContext(null);

export function MoviesProvider({ children }) {
  const movies = useMovies();
  return <MoviesContext.Provider value={movies}>{children}</MoviesContext.Provider>;
}

export function useMoviesContext() {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error("useMoviesContext must be used inside <MoviesProvider>");
  return ctx;
}
