import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMovies, fetchTheatres } from "../api/services";
import { getErrorMessage } from "../api/client";

/**
 * Custom hook: manages movie data, movie search, genre filtering and movie selection.
 * Data is loaded from the REST API when the application starts (useEffect).
 */
export default function useMovies() {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Load movies + theatres on start (and when reload() is called)
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [movieData, theatreData] = await Promise.all([
          fetchMovies(controller.signal),
          fetchTheatres(controller.signal),
        ]);
        setMovies(movieData);
        setTheatres(theatreData);
      } catch (err) {
        const msg = getErrorMessage(err);
        if (msg && err.name !== "AbortError") setError(msg);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [reloadKey]);

  // Genres list derived from the data
  const genres = useMemo(() => ["All", ...new Set(movies.map((m) => m.genre))], [movies]);

  // Filtered movies – recalculated only when movies/search/genre change
  const filteredMovies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return movies.filter(
      (m) => (genre === "All" || m.genre === genre) && (!q || m.title.toLowerCase().includes(q) || m.cast.some((c) => c.toLowerCase().includes(q)))
    );
  }, [movies, search, genre]);

  // Keep the browser tab title in sync with the displayed results
  useEffect(() => {
    document.title = `CineBook – ${filteredMovies.length} movie${filteredMovies.length === 1 ? "" : "s"}`;
  }, [filteredMovies.length]);

  const selectMovie = useCallback((movie) => setSelectedMovie(movie), []);
  const reload = useCallback(() => setReloadKey((k) => k + 1), []);
  const clearFilters = useCallback(() => {
    setSearch("");
    setGenre("All");
  }, []);

  return {
    movies,
    theatres,
    filteredMovies,
    genres,
    loading,
    error,
    search,
    setSearch,
    genre,
    setGenre,
    selectedMovie,
    selectMovie,
    reload,
    clearFilters,
  };
}
