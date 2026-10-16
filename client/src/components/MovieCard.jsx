import { Link } from "react-router-dom";
import Button from "./Button";

// Reusable movie card (props: movie, selected, onSelect, onBook)
export default function MovieCard({ movie, selected = false, onSelect, onBook }) {
  return (
    <article
      className={`card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md ${
        selected ? "ring-2 ring-brand-500" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect?.(movie)}
        className={`flex h-40 items-center justify-center bg-gradient-to-br text-6xl sm:h-48 ${movie.color}`}
        aria-label={`Select ${movie.title}`}
      >
        <span aria-hidden="true">{movie.emoji}</span>
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-slate-900">{movie.title}</h3>
          <span className="shrink-0 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            ⭐ {movie.rating}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {movie.genre} • {movie.duration}
        </p>
        <div className="mt-4 flex gap-2 pt-1">
          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 rounded-lg px-3 py-2 text-center text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
          >
            Details
          </Link>
          <Button size="sm" className="flex-1" onClick={() => onBook?.(movie)}>
            Book Now
          </Button>
        </div>
      </div>
    </article>
  );
}
