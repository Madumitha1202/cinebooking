import api from "./client";

/* ---------- Public data ---------- */
export const fetchMovies = async (signal) => (await api.get("/movies", { signal })).data;
export const fetchMovie = async (id, signal) => (await api.get(`/movies/${id}`, { signal })).data;

// Uses the native Fetch API (to demonstrate Fetch alongside Axios)
export const fetchTheatres = async (signal) => {
  const res = await fetch("/api/theatres", { signal });
  if (!res.ok) throw new Error("Failed to load theatres");
  return res.json();
};

export const fetchShows = async (theatreId, movieId, signal) =>
  (await api.get(`/theatres/${theatreId}/shows`, { params: { movieId }, signal })).data;

export const fetchSeats = async (showId, signal) => (await api.get(`/shows/${showId}/seats`, { signal })).data;

/* ---------- Auth ---------- */
export const loginApi = async (credentials) => (await api.post("/auth/login", credentials)).data;
export const registerApi = async (payload) => (await api.post("/auth/register", payload)).data;
export const meApi = async () => (await api.get("/auth/me")).data;

/* ---------- Bookings CRUD (protected) ---------- */
export const getBookings = async () => (await api.get("/bookings")).data; // READ
export const createBooking = async (payload) => (await api.post("/bookings", payload)).data; // CREATE
export const updateBooking = async (id, changes) => (await api.patch(`/bookings/${id}`, changes)).data; // UPDATE (PATCH)
export const replaceBooking = async (id, body) => (await api.put(`/bookings/${id}`, body)).data; // UPDATE (PUT)
export const cancelBooking = async (id) => (await api.delete(`/bookings/${id}`)).data; // DELETE
