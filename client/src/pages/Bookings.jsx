import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getBookings, updateBooking, cancelBooking } from "../api/services";
import { getErrorMessage } from "../api/client";
import { formatCurrency } from "../utils/pricing";
import { required, validatePhone } from "../utils/validators";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import Input from "../components/Input";

// Booking history: READ (GET), UPDATE (PATCH) and CANCEL (DELETE)
export default function Bookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(location.state?.justBooked ? `🎉 Booking ${location.state.justBooked.id} confirmed!` : "");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setBookings(await getBookings());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const replaceItem = (updated) => setBookings((list) => list.map((b) => (b.id === updated.id ? updated : b)));

  return (
    <section>
      <h1 className="page-title">My Bookings</h1>
      {notice && (
        <div className="mb-4 flex items-center justify-between rounded-lg bg-emerald-50 p-3 text-emerald-700" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss" className="px-2">
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <Loading text="Loading your bookings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={load} />
      ) : bookings.length === 0 ? (
        <div className="card py-12 text-center text-slate-500">
          <div className="text-4xl">🎟️</div>
          <p className="mt-2 text-lg font-medium">No bookings yet</p>
          <Link to="/movies" className="mt-2 inline-block font-semibold text-brand-600 underline">
            Book your first movie
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <BookingItem key={b.id} booking={b} onChange={replaceItem} onMessage={setNotice} />
          ))}
        </ul>
      )}
    </section>
  );
}

function BookingItem({ booking, onChange, onMessage }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: booking.customer.name, phone: booking.customer.phone });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cancelled = booking.status === "CANCELLED";

  const save = async () => {
    const found = {};
    const nameErr = required(form.name, "Name");
    const phoneErr = validatePhone(form.phone);
    if (nameErr) found.name = nameErr;
    if (phoneErr) found.phone = phoneErr;
    setErrors(found);
    if (Object.keys(found).length) return;

    setBusy(true);
    setError("");
    try {
      onChange(await updateBooking(booking.id, { customer: form })); // PATCH
      setEditing(false);
      onMessage(`✅ Booking ${booking.id} updated`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (!window.confirm(`Cancel booking ${booking.id}? Your seats will be released.`)) return;
    setBusy(true);
    setError("");
    try {
      onChange(await cancelBooking(booking.id)); // DELETE
      onMessage(`Booking ${booking.id} cancelled and refunded`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className={`card p-5 ${cancelled ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{booking.movieTitle}</h2>
          <p className="text-sm text-slate-500">
            {booking.theatreName} • {booking.showTime}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            cancelled ? "bg-slate-200 text-slate-600" : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {booking.status}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Booking ID" value={booking.id} />
        <Field label="Seats" value={booking.seats.join(", ")} />
        <Field label="Total" value={formatCurrency(booking.total)} />
        <Field label="Booked on" value={new Date(booking.createdAt).toLocaleString()} />
        <Field label="Name" value={booking.customer.name} />
        <Field label="Phone" value={booking.customer.phone} />
        <Field label="Payment" value={`${booking.payment.method.toUpperCase()} • ${booking.payment.status}`} />
      </dl>

      {editing && (
        <div className="mt-4 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-2">
          <Input label="Name" value={form.name} error={errors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" value={form.phone} error={errors.phone} maxLength={10} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <div className="flex gap-2 sm:col-span-2">
            <Button size="sm" onClick={save} loading={busy}>
              Save changes
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditing(false)}>
              Close
            </Button>
          </div>
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}

      {!cancelled && !editing && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setEditing(true)} disabled={busy}>
            Edit details
          </Button>
          <Button size="sm" variant="danger" onClick={cancel} loading={busy}>
            Cancel booking
          </Button>
        </div>
      )}
    </li>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}
