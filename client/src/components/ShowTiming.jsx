import { useEffect, useState } from "react";
import { fetchShows } from "../api/services";
import { getErrorMessage } from "../api/client";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

// Loads and shows the available show timings for a movie in a theatre
export default function ShowTiming({ movieId, theatre, selectedId, onSelect }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!theatre || !movieId) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchShows(theatre.id, movieId, controller.signal)
      .then(setShows)
      .catch((err) => {
        const msg = getErrorMessage(err);
        if (msg) setError(msg);
      })
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [theatre, movieId, attempt]);

  if (!theatre) return <p className="text-slate-500">Select a theatre to see show timings.</p>;
  if (loading) return <Loading text="Loading show timings..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />;
  if (shows.length === 0) return <p className="text-slate-500">No shows available</p>;

  return (
    <div className="flex flex-wrap gap-3">
      {shows.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s)}
          aria-pressed={s.id === selectedId}
          className={`rounded-lg px-4 py-2 text-center transition ${
            s.id === selectedId
              ? "bg-brand-500 text-white"
              : "bg-white text-slate-700 ring-1 ring-slate-300 hover:ring-brand-500"
          }`}
        >
          <span className="block font-semibold">{s.time}</span>
          <span className="block text-xs opacity-80">from ₹{s.price}</span>
        </button>
      ))}
    </div>
  );
}
