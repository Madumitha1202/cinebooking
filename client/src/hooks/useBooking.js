import { useCallback, useEffect, useMemo, useState } from "react";
import { useBookingStore, STORAGE_KEY } from "../store/bookingStore";
import { createBooking } from "../api/services";
import { MAX_SEATS, CONVENIENCE_RATE, seatPrice } from "../utils/pricing";

/**
 * Custom hook: manages theatre selection, show timing, selected seats,
 * ticket count and booking information.
 * State lives in the Zustand store; derived values use useMemo and the
 * operations use useCallback.
 */
export default function useBooking() {
  const { movie, theatre, show, seats, customer, setMovie, setTheatre, setShow, setSeats, setCustomer, reset } =
    useBookingStore();
  const [seatError, setSeatError] = useState("");

  // Synchronise booking information with browser storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ movie, theatre, show, seats, customer }));
    } catch {
      /* storage may be unavailable (private mode) – ignore */
    }
  }, [movie, theatre, show, seats, customer]);

  // Derived values
  const seatCount = useMemo(() => seats.length, [seats]);
  const ticketCost = useMemo(() => seats.reduce((sum, id) => sum + seatPrice(show, id), 0), [seats, show]);
  const convenienceFee = useMemo(() => Math.round(ticketCost * CONVENIENCE_RATE), [ticketCost]);
  const total = useMemo(() => ticketCost + convenienceFee, [ticketCost, convenienceFee]);

  /* ---------- operations (stable references via useCallback) ---------- */
  const selectMovie = useCallback((m) => setMovie(m), [setMovie]);
  const selectTheatre = useCallback((t) => setTheatre(t), [setTheatre]);
  const selectShow = useCallback((s) => setShow(s), [setShow]);

  const selectSeat = useCallback(
    (seatId) => {
      const current = useBookingStore.getState().seats;
      if (current.includes(seatId)) return;
      if (current.length >= MAX_SEATS) {
        setSeatError(`You can select a maximum of ${MAX_SEATS} seats`);
        return;
      }
      setSeatError("");
      setSeats([...current, seatId].sort());
    },
    [setSeats]
  );

  const removeSeat = useCallback(
    (seatId) => {
      setSeatError("");
      setSeats(useBookingStore.getState().seats.filter((s) => s !== seatId));
    },
    [setSeats]
  );

  const toggleSeat = useCallback(
    (seatId) => {
      if (useBookingStore.getState().seats.includes(seatId)) removeSeat(seatId);
      else selectSeat(seatId);
    },
    [selectSeat, removeSeat]
  );

  const clearBooking = useCallback(() => {
    setSeatError("");
    reset();
  }, [reset]);

  // Sends the booking to the API; clears the booking on success
  const confirmBooking = useCallback(
    async (payment) => {
      const { movie, theatre, show, seats, customer } = useBookingStore.getState();
      const booking = await createBooking({
        movieId: movie.id,
        theatreId: theatre.id,
        showId: show.id,
        seats,
        customer,
        payment,
      });
      reset();
      return booking;
    },
    [reset]
  );

  return {
    movie,
    theatre,
    show,
    seats,
    customer,
    seatCount,
    ticketCost,
    convenienceFee,
    total,
    seatError,
    selectMovie,
    selectTheatre,
    selectShow,
    selectSeat,
    removeSeat,
    toggleSeat,
    setCustomer,
    clearBooking,
    confirmBooking,
  };
}
