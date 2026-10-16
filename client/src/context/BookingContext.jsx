import { createContext, useContext } from "react";
import useBooking from "../hooks/useBooking";

// Shares selected movie, theatre, show timing, seats and booking details between components
// so they do not have to be passed through props at every level.
const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const booking = useBooking();
  return <BookingContext.Provider value={booking}>{children}</BookingContext.Provider>;
}

export function useBookingContext() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookingContext must be used inside <BookingProvider>");
  return ctx;
}

export default BookingContext;
