import { useNavigate } from "react-router-dom";
import { useMoviesContext } from "../context/MoviesContext";
import { useBookingContext } from "../context/BookingContext";
import TheatreList from "../components/TheatreList";
import ShowTiming from "../components/ShowTiming";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

// Step 1: Theatre selection + show selection
export default function BookingTheatre() {
  const { theatres, loading, error, reload } = useMoviesContext();
  const { movie, theatre, show, selectTheatre, selectShow } = useBookingContext();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-xl font-bold">1. Select a theatre</h2>
        {loading ? (
          <Loading text="Loading theatres..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={reload} />
        ) : (
          <TheatreList theatres={theatres} selectedId={theatre?.id} onSelect={selectTheatre} />
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">2. Select a show timing</h2>
        <ShowTiming movieId={movie.id} theatre={theatre} selectedId={show?.id} onSelect={selectShow} />
      </section>

      <div className="flex justify-end">
        <Button size="lg" disabled={!show} onClick={() => navigate("/booking/seats")}>
          Continue to seats →
        </Button>
      </div>
    </div>
  );
}
