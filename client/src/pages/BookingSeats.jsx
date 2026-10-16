import { Navigate, useNavigate } from "react-router-dom";
import { useBookingContext } from "../context/BookingContext";
import SeatSelection from "../components/SeatSelection";
import Button from "../components/Button";

// Step 2: Seat selection
export default function BookingSeats() {
  const { show, seatCount } = useBookingContext();
  const navigate = useNavigate();

  if (!show) return <Navigate to="/booking/theatre" replace />;

  return (
    <div className="space-y-6">
      <SeatSelection />
      <div className="flex justify-between">
        <Button variant="secondary" onClick={() => navigate("/booking/theatre")}>
          ← Back
        </Button>
        <Button size="lg" disabled={seatCount === 0} onClick={() => navigate("/booking/summary")}>
          Continue to summary →
        </Button>
      </div>
    </div>
  );
}
