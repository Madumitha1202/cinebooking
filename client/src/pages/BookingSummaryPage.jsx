import { Navigate, useNavigate } from "react-router-dom";
import { useBookingContext } from "../context/BookingContext";
import BookingSummary from "../components/BookingSummary";
import Button from "../components/Button";

// Step 3: Booking summary
export default function BookingSummaryPage() {
  const { show, seatCount, clearBooking } = useBookingContext();
  const navigate = useNavigate();

  if (!show) return <Navigate to="/booking/theatre" replace />;
  if (seatCount === 0) return <Navigate to="/booking/seats" replace />;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <BookingSummary />
      <div className="flex flex-wrap justify-between gap-3">
        <Button variant="secondary" onClick={() => navigate("/booking/seats")}>
          ← Change seats
        </Button>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            onClick={() => {
              clearBooking();
              navigate("/movies");
            }}
          >
            Cancel
          </Button>
          <Button size="lg" onClick={() => navigate("/checkout")}>
            Proceed to payment →
          </Button>
        </div>
      </div>
    </div>
  );
}
