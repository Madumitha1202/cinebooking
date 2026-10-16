import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMoviesContext } from "../context/MoviesContext";
import { useBookingContext } from "../context/BookingContext";
import SearchBar from "../components/SearchBar";
import MovieList from "../components/MovieList";

// Search + genre filter + movie grid. Used on the Home page and on /movies.
export default function Movies({ showTitle = true }) {
  const {
    filteredMovies, genres, loading, error, search, setSearch, genre, setGenre,
    selectedMovie, selectMovie, reload, clearFilters,
  } = useMoviesContext();
  const { selectMovie: startBooking } = useBookingContext();
  const navigate = useNavigate();

  // Reusable callback: choose the movie and start the booking flow
  const handleBook = useCallback(
    (movie) => {
      startBooking(movie);
      navigate("/booking/theatre");
    },
    [startBooking, navigate]
  );

  return (
    <section>
      {showTitle && <h1 className="page-title">Now Showing</h1>}
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        genres={genres}
        genre={genre}
        onGenreChange={setGenre}
        onClear={clearFilters}
      />
      <div className="mt-6">
        <MovieList
          movies={filteredMovies}
          loading={loading}
          error={error}
          selectedId={selectedMovie?.id}
          onSelect={selectMovie}
          onBook={handleBook}
          onRetry={reload}
        />
      </div>
    </section>
  );
}
