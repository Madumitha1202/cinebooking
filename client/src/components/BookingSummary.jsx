import { useBookingContext } from "../context/BookingContext";
import { formatCurrency } from "../utils/pricing";

// Summary of the current booking (reads everything from BookingContext)
export default function BookingSummary() {
  const { movie, theatre, show, seats, seatCount, ticketCost, convenienceFee, total } = useBookingContext();

  if (!movie || !theatre || !show) {
    return <div className="card p-6 text-center text-slate-500">No booking in progress. Please select a movie, theatre and show.</div>;
  }

  return (
    <aside className="card p-5" aria-label="Booking summary">
      <div className="flex items-center gap-3">
        <div className={`flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br text-2xl ${movie.color}`}>
          {movie.emoji}
        </div>
        <div>
          <h3 className="font-bold text-slate-900">{movie.title}</h3>
          <p className="text-sm text-slate-500">
            {movie.genre} • {movie.duration}
          </p>
        </div>
      </div>

      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Theatre" value={theatre.name} />
        <Row label="Show" value={show.time} />
        <Row label="Seats" value={seatCount ? seats.join(", ") : "—"} />
        <Row label={`Tickets (${seatCount})`} value={formatCurrency(ticketCost)} />
        <Row label="Convenience fee (5%)" value={formatCurrency(convenienceFee)} />
      </dl>

      <div className="mt-4 flex items-center justify-between border-t pt-3 text-lg font-bold text-slate-900">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </aside>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-800">{value}</dd>
    </div>
  );
}
