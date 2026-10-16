import { Link, Outlet, useLocation } from "react-router-dom";
import { useBookingContext } from "../context/BookingContext";

const steps = [
  { path: "/booking/theatre", label: "Theatre & Show" },
  { path: "/booking/seats", label: "Seats" },
  { path: "/booking/summary", label: "Summary" },
  { path: "/checkout", label: "Payment" },
];

// Parent route of /booking – renders the step indicator and the nested step via <Outlet />
export default function BookingLayout() {
  const { pathname } = useLocation();
  const { movie } = useBookingContext();
  const current = Math.max(0, steps.findIndex((s) => pathname.startsWith(s.path)));

  if (!movie) {
    return (
      <div className="card p-10 text-center">
        <div className="text-4xl">🎬</div>
        <p className="mt-2 text-lg font-medium text-slate-700">No movie selected</p>
        <Link to="/movies" className="mt-3 inline-block font-semibold text-brand-600 underline">
          Choose a movie to start booking
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Book tickets: {movie.title}</h1>
      <ol className="mb-6 flex flex-wrap gap-2 text-sm" aria-label="Booking progress">
        {steps.map((s, i) => (
          <li
            key={s.path}
            aria-current={i === current ? "step" : undefined}
            className={`rounded-full px-3 py-1 font-medium ${
              i === current ? "bg-brand-500 text-white" : i < current ? "bg-rose-100 text-brand-600" : "bg-slate-200 text-slate-500"
            }`}
          >
            {i + 1}. {s.label}
          </li>
        ))}
      </ol>
      <Outlet />
    </div>
  );
}
