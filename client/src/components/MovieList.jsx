import MovieCard from "./MovieCard";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

// Responsive grid of MovieCards with loading / error / empty states
export default function MovieList({ movies, loading, error, selectedId, onSelect, onBook, onRetry }) {
  if (loading) return <Loading text="Loading movies..." />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  if (movies.length === 0) {
    return (
      <div className="card py-12 text-center text-slate-500">
        <div className="text-4xl">🎞️</div>
        <p className="mt-2 text-lg font-medium">No movies available</p>
        <p className="text-sm">Try a different search or genre.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} selected={movie.id === selectedId} onSelect={onSelect} onBook={onBook} />
      ))}
    </div>
  );
}
