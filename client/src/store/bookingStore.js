import { create } from "zustand";

/**
 * Global booking store (Zustand).
 * Keeps the booking state alive across MovieList, SeatSelection and Checkout.
 */

export const STORAGE_KEY = "cinebook_booking";

const emptyBooking = {
  movie: null,
  theatre: null,
  show: null,
  seats: [],
  customer: { name: "", email: "", phone: "" },
};

// Restore a previously saved booking from browser storage
const loadInitial = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...emptyBooking, ...saved } : emptyBooking;
  } catch {
    return emptyBooking;
  }
};

/* ---------------- Middleware ---------------- */
// Logger middleware: logs every booking action (only during development)
const logger = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const before = get();
      set(partial, replace);
      if (import.meta.env.DEV) {
        console.groupCollapsed("%c[booking store] update", "color:#e11d48");
        console.log("prev", before);
        console.log("next", get());
        console.groupEnd();
      }
    },
    get,
    api
  );

// Rules middleware: whenever the movie/theatre/show changes, dependent selections are reset
const consistency = (config) => (set, get, api) =>
  config(
    (partial, replace) => {
      const patch = typeof partial === "function" ? partial(get()) : partial;
      const prev = get();
      const next = { ...patch };
      if ("movie" in patch && patch.movie?.id !== prev.movie?.id) {
        Object.assign(next, { theatre: null, show: null, seats: [] });
      } else if ("theatre" in patch && patch.theatre?.id !== prev.theatre?.id) {
        Object.assign(next, { show: null, seats: [] });
      } else if ("show" in patch && patch.show?.id !== prev.show?.id) {
        Object.assign(next, { seats: [] });
      }
      set(next, replace);
    },
    get,
    api
  );

export const useBookingStore = create(
  logger(
    consistency((set) => ({
      ...loadInitial(),
      setMovie: (movie) => set({ movie }),
      setTheatre: (theatre) => set({ theatre }),
      setShow: (show) => set({ show }),
      setSeats: (seats) => set({ seats }),
      setCustomer: (changes) => set((s) => ({ customer: { ...s.customer, ...changes } })),
      reset: () => set({ ...emptyBooking, customer: { ...emptyBooking.customer } }),
    }))
  )
);
