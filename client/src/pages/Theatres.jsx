import { useMoviesContext } from "../context/MoviesContext";
import TheatreList from "../components/TheatreList";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function Theatres() {
  const { theatres, loading, error, reload } = useMoviesContext();
  return (
    <section>
      <h1 className="page-title">Theatres</h1>
      {loading ? <Loading text="Loading theatres..." /> : error ? <ErrorMessage message={error} onRetry={reload} /> : <TheatreList theatres={theatres} />}
    </section>
  );
}
