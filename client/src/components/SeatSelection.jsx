import { useEffect, useMemo, useState } from "react";
import { fetchSeats } from "../api/services";
import { getErrorMessage } from "../api/client";
import { useBookingContext } from "../context/BookingContext";
import { SEAT_ROWS, SEATS_PER_ROW, rowTier, formatCurrency, seatPrice } from "../utils/pricing";
import Seat from "./Seat";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

// Seat map. Booking data comes from BookingContext (no props drilling).
export default function SeatSelection() {
  const { show, seats, toggleSeat, removeSeat, seatError, seatCount, ticketCost } = useBookingContext();
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  // Load the already-booked seats for this show
  useEffect(() => {
    if (!show) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetchSeats(show.id, controller.signal)
      .then((data) => setBooked(data.booked))
      .catch((err) => {
        const msg = getErrorMessage(err);
        if (msg) setError(msg);
      })
      .finally(() => !controller.signal.aborted && setLoading(false));
    return () => controller.abort();
  }, [show, attempt]);

  // If a seat got booked by someone else meanwhile, drop it from our selection
  useEffect(() => {
    seats.filter((s) => booked.includes(s)).forEach(removeSeat);
  }, [booked, seats, removeSeat]);

  const rows = useMemo(
    () => SEAT_ROWS.map((row) => ({ row, tier: rowTier(row), seats: Array.from({ length: SEATS_PER_ROW }, (_, i) => `${row}${i + 1}`) })),
    []
  );

  if (!show) return <p className="card p-6 text-center text-slate-500">Please select a show timing first.</p>;
  if (loading) return <Loading text="Loading seat map..." />;
  if (error) return <ErrorMessage message={error} onRetry={() => setAttempt((a) => a + 1)} />;

  const statusOf = (id) => (booked.includes(id) ? "booked" : seats.includes(id) ? "selected" : "available");

  return (
    <div className="card p-4 sm:p-6">
      <div className="mx-auto mb-6 h-2 w-3/4 rounded-full bg-slate-300" aria-hidden="true" />
      <p className="mb-6 text-center text-xs uppercase tracking-widest text-slate-400">All eyes this way – Screen</p>

      <div className="overflow-x-auto">
        <div className="mx-auto w-fit space-y-2">
          {rows.map(({ row, tier, seats: rowSeats }) => (
            <div key={row} className="flex items-center gap-2">
              <span className="w-4 text-xs font-bold text-slate-500">{row}</span>
              <div className="flex gap-1 sm:gap-1.5">
                {rowSeats.map((id) => (
                  <Seat key={id} id={id} status={statusOf(id)} onToggle={toggleSeat} />
                ))}
              </div>
              <span className="hidden w-16 text-xs text-slate-400 sm:block">{tier}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-slate-600">
        <Legend className="bg-white ring-1 ring-slate-300" label="Available" />
        <Legend className="bg-brand-500" label="Selected" />
        <Legend className="bg-slate-200" label="Booked" />
        <span>Premium ×1.5 • Gold ×1.2 • Silver ×1</span>
      </div>

      {seatError && (
        <p className="mt-4 text-center text-sm text-red-600" role="alert">
          {seatError}
        </p>
      )}

      <div className="mt-6 border-t pt-4 text-center">
        {seatCount === 0 ? (
          <p className="font-medium text-slate-500">Please select your seats</p>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              {seatCount} seat{seatCount > 1 ? "s" : ""} selected • {formatCurrency(ticketCost)}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {seats.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => removeSeat(id)}
                  className="rounded-full bg-rose-50 px-3 py-1 text-sm font-medium text-brand-600 hover:bg-rose-100"
                  title={`Remove ${id}`}
                >
                  {id} ({formatCurrency(seatPrice(show, id))}) ✕
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Legend({ className, label }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`inline-block h-4 w-4 rounded-t ${className}`} /> {label}
    </span>
  );
}
