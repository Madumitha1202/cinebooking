import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchMovie } from "../api/services";
import { getErrorMessage } from "../api/client";
import { useBookingContext } from "../context/BookingContext";
import Button from "../components/Button";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

// Dynamic route: /movie/:id  (e.g. /movie/101)
export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectMovie } = useBookingContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchMovie(id, controller.signal)
      .then(setMovie)
      .catch((err) => {
        const msg = getErrorMessage(err);
        if (msg) setError(err.response?.status === 404 ? "Movie not found" : msg);
      })
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [id, attempt]);

  if (loading) return <Loading text="Loading movie details..." />;
  if (error)
    return (
      <div className="space-y-4">
        <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />
        <Link to="/movies" className="text-brand-600 underline">
          ← Back to movies
        </Link>
      </div>
    );

  const handleBook = () => {
    selectMovie(movie);
    navigate("/booking/theatre");
  };

  return (
    <article className="card overflow-hidden md:flex">
      <div className={`flex h-56 items-center justify-center bg-gradient-to-br text-8xl md:h-auto md:w-72 ${movie.color}`}>
        <span aria-hidden="true">{movie.emoji}</span>
      </div>
      <div className="flex-1 p-5 sm:p-8">
        <Link to="/movies" className="text-sm text-slate-500 hover:text-brand-600">
          ← Back to movies
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">{movie.title}</h1>

        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
          <Info label="Genre" value={movie.genre} />
          <Info label="Rating" value={`⭐ ${movie.rating} / 5`} />
          <Info label="Duration" value={movie.duration} />
          <Info label="Cast" value={movie.cast.join(", ")} />
        </dl>

        <h2 className="mt-6 font-semibold text-slate-900">Description</h2>
        <p className="mt-1 text-slate-600">{movie.description}</p>

        <Button size="lg" className="mt-8 w-full sm:w-auto" onClick={handleBook}>
          🎟 Book Tickets
        </Button>
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
