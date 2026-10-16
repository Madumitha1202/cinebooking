import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookingContext } from "../context/BookingContext";
import { getErrorMessage } from "../api/client";
import { validateBookingForm, validatePaymentForm } from "../utils/validators";
import { formatCurrency } from "../utils/pricing";
import BookingSummary from "../components/BookingSummary";
import Payment from "../components/Payment";
import Input from "../components/Input";
import Button from "../components/Button";

const emptyPayment = { method: "card", cardNumber: "", cardName: "", expiry: "", cvv: "", upiId: "" };

// Used by both /checkout and /payment (protected routes)
export default function Checkout() {
  const { user } = useAuth();
  const { movie, theatre, show, seats, customer, setCustomer, confirmBooking, total } = useBookingContext();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(emptyPayment);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false); // stops the "no booking" redirect right after a successful booking

  // Pre-fill customer details from the logged-in user
  useEffect(() => {
    if (user && (!customer.name || !customer.email)) {
      setCustomer({ name: customer.name || user.name, email: customer.email || user.email });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!submittedRef.current && (!movie || !theatre || !show)) return <Navigate to="/movies" replace />;
  if (!submittedRef.current && seats.length === 0) return <Navigate to="/booking/seats" replace />;
  if (submittedRef.current && !movie) return null;

  const field = (name) => ({
    value: customer[name],
    error: errors[name],
    onChange: (e) => {
      setCustomer({ [name]: e.target.value });
      if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const found = { ...validateBookingForm({ customer, seats }), ...validatePaymentForm(payment) };
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    submittedRef.current = true;
    try {
      const booking = await confirmBooking(payment);
      navigate("/bookings", { replace: true, state: { justBooked: booking } });
    } catch (err) {
      submittedRef.current = false;
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) setErrors(serverErrors);
      setSubmitError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="page-title">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} noValidate className="card space-y-8 p-5 sm:p-6 lg:col-span-2">
          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-bold text-slate-900">Your details</legend>
            <Input label="Full name" autoComplete="name" {...field("name")} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" autoComplete="email" {...field("email")} />
              <Input label="Phone number" type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" autoComplete="tel" {...field("phone")} />
            </div>
            {errors.seats && <p className="text-sm text-red-600">{errors.seats}</p>}
          </fieldset>

          <Payment
            value={payment}
            onChange={(p) => {
              setPayment(p);
              setErrors((prev) => ({ ...prev, cardNumber: "", cardName: "", expiry: "", cvv: "", upiId: "", method: "" }));
            }}
            errors={errors}
          />

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {submitError}
              {submitError.toLowerCase().includes("already booked") && (
                <Button variant="secondary" size="sm" className="ml-3" onClick={() => navigate("/booking/seats")}>
                  Choose other seats
                </Button>
              )}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={submitting}>
            Pay {formatCurrency(total)} &amp; confirm booking
          </Button>
        </form>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingSummary />
        </div>
      </div>
    </div>
  );
}
