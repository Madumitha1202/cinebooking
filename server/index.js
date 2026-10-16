import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  movies,
  theatres,
  getShows,
  findShow,
  getBookedSet,
  users,
  bookings,
  nextBookingId,
  nextUserId,
  SEAT_ROWS,
  SEATS_PER_ROW,
  rowMultiplier,
  CONVENIENCE_RATE,
} from "./data.js";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "movie-booking-dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

app.use(cors());
app.use(express.json());

// Small artificial delay so loading states are visible in the UI
const delay = (ms) => (_req, _res, next) => setTimeout(next, ms);
app.use(delay(Number(process.env.API_DELAY_MS ?? 300)));

/* ------------------------------ helpers ------------------------------ */
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || "");
const isPhone = (v) => /^[6-9]\d{9}$/.test(v || "");
const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email });

function calcAmounts(show, seats) {
  const ticketCost = seats.reduce((sum, seatId) => sum + Math.round(show.price * rowMultiplier(seatId[0])), 0);
  const convenienceFee = Math.round(ticketCost * CONVENIENCE_RATE);
  return { ticketCost, convenienceFee, total: ticketCost + convenienceFee };
}

function validSeatId(id) {
  const row = id?.[0];
  const num = Number(id?.slice(1));
  return SEAT_ROWS.includes(row) && Number.isInteger(num) && num >= 1 && num <= SEATS_PER_ROW;
}

/* ------------------------------ auth middleware ------------------------------ */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ code: "NO_TOKEN", message: "Authentication required" });
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    const expired = err.name === "TokenExpiredError";
    return res.status(401).json({
      code: expired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
      message: expired ? "Session expired. Please login again." : "Invalid token",
    });
  }
}

/* ------------------------------ auth routes ------------------------------ */
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !isEmail(email) || !password || password.length < 6) {
    return res.status(400).json({ message: "Name, valid email and password (min 6 chars) are required" });
  }
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const user = { id: nextUserId(), name, email, passwordHash: bcrypt.hashSync(password, 8) };
  users.push(user);
  res.status(201).json({ token: signToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email.toLowerCase() === String(email || "").toLowerCase());
  if (!user || !bcrypt.compareSync(password || "", user.passwordHash)) {
    return res.status(401).json({ code: "BAD_CREDENTIALS", message: "Invalid email or password" });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ code: "INVALID_TOKEN", message: "User not found" });
  res.json({ user: publicUser(user) });
});

/* ------------------------------ movies / theatres / shows (public) ------------------------------ */
app.get("/api/movies", (req, res) => {
  const { search = "", genre = "" } = req.query;
  const result = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(String(search).toLowerCase()) &&
      (!genre || genre === "All" || m.genre === genre)
  );
  res.json(result);
});

app.get("/api/movies/:id", (req, res) => {
  const movie = movies.find((m) => m.id === Number(req.params.id));
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

app.get("/api/theatres", (_req, res) => res.json(theatres));

app.get("/api/theatres/:id/shows", (req, res) => {
  const { movieId } = req.query;
  if (!theatres.some((t) => t.id === Number(req.params.id))) {
    return res.status(404).json({ message: "Theatre not found" });
  }
  if (!movieId) return res.status(400).json({ message: "movieId query param is required" });
  res.json(getShows(req.params.id, movieId));
});

app.get("/api/shows/:id/seats", (req, res) => {
  const show = findShow(req.params.id);
  if (!show) return res.status(404).json({ message: "Show not found" });
  res.json({ show, booked: [...getBookedSet(show.id)] });
});

/* ------------------------------ bookings (protected CRUD) ------------------------------ */
// READ - booking history of the logged-in user
app.get("/api/bookings", requireAuth, (req, res) => {
  res.json(bookings.filter((b) => b.userId === req.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
});

app.get("/api/bookings/:id", requireAuth, (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.json(booking);
});

function validateCustomer(c = {}) {
  const errors = {};
  if (!c.name?.trim()) errors.name = "Name is required";
  if (!isEmail(c.email)) errors.email = "Valid email is required";
  if (!isPhone(c.phone)) errors.phone = "Valid 10-digit phone number is required";
  return errors;
}

function validatePayment(p = {}) {
  const errors = {};
  if (!["card", "upi"].includes(p.method)) errors.method = "Payment method is required";
  if (p.method === "card") {
    if (!/^\d{16}$/.test(String(p.cardNumber || "").replace(/\s/g, ""))) errors.cardNumber = "Card number must be 16 digits";
  }
  if (p.method === "upi" && !/^[\w.\-]+@[\w]+$/.test(p.upiId || "")) errors.upiId = "Valid UPI ID is required";
  return errors;
}

// CREATE
app.post("/api/bookings", requireAuth, (req, res) => {
  const { movieId, theatreId, showId, seats, customer, payment } = req.body || {};
  const movie = movies.find((m) => m.id === Number(movieId));
  const show = findShow(showId);
  if (!movie || !show || show.theatreId !== Number(theatreId) || show.movieId !== movie.id) {
    return res.status(400).json({ message: "Invalid movie, theatre or show" });
  }
  if (!Array.isArray(seats) || seats.length === 0 || seats.length > 8 || !seats.every(validSeatId)) {
    return res.status(400).json({ message: "Select between 1 and 8 valid seats" });
  }
  const errors = { ...validateCustomer(customer), ...validatePayment(payment) };
  if (Object.keys(errors).length) return res.status(400).json({ message: "Validation failed", errors });

  const taken = getBookedSet(show.id);
  const conflict = seats.filter((s) => taken.has(s));
  if (conflict.length) {
    return res.status(409).json({ message: `Seats already booked: ${conflict.join(", ")}` });
  }

  seats.forEach((s) => taken.add(s));
  const amounts = calcAmounts(show, seats);
  const booking = {
    id: nextBookingId(),
    userId: req.user.id,
    movieId: movie.id,
    movieTitle: movie.title,
    theatreId: show.theatreId,
    theatreName: theatres.find((t) => t.id === show.theatreId).name,
    showId: show.id,
    showTime: show.time,
    seats: [...seats].sort(),
    customer,
    payment: {
      method: payment.method,
      status: "PAID",
      reference: payment.method === "card" ? `**** **** **** ${String(payment.cardNumber).replace(/\s/g, "").slice(-4)}` : payment.upiId,
    },
    ...amounts,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// UPDATE (PUT/PATCH) - change customer details and/or seats
function updateBooking(req, res) {
  const booking = bookings.find((b) => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "CANCELLED") return res.status(400).json({ message: "Cancelled bookings cannot be modified" });

  const { customer, seats } = req.body || {};
  if (customer) {
    const merged = { ...booking.customer, ...customer };
    const errors = validateCustomer(merged);
    if (Object.keys(errors).length) return res.status(400).json({ message: "Validation failed", errors });
    booking.customer = merged;
  }
  if (seats) {
    if (!Array.isArray(seats) || seats.length === 0 || seats.length > 8 || !seats.every(validSeatId)) {
      return res.status(400).json({ message: "Select between 1 and 8 valid seats" });
    }
    const taken = getBookedSet(booking.showId);
    const conflict = seats.filter((s) => taken.has(s) && !booking.seats.includes(s));
    if (conflict.length) return res.status(409).json({ message: `Seats already booked: ${conflict.join(", ")}` });
    booking.seats.forEach((s) => taken.delete(s));
    seats.forEach((s) => taken.add(s));
    booking.seats = [...seats].sort();
    Object.assign(booking, calcAmounts(findShow(booking.showId), booking.seats));
  }
  booking.updatedAt = new Date().toISOString();
  res.json(booking);
}
app.put("/api/bookings/:id", requireAuth, updateBooking);
app.patch("/api/bookings/:id", requireAuth, updateBooking);

// DELETE - cancel booking and release seats (kept in history as CANCELLED)
app.delete("/api/bookings/:id", requireAuth, (req, res) => {
  const booking = bookings.find((b) => b.id === req.params.id && b.userId === req.user.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.status === "CANCELLED") return res.status(400).json({ message: "Booking already cancelled" });
  const taken = getBookedSet(booking.showId);
  booking.seats.forEach((s) => taken.delete(s));
  booking.status = "CANCELLED";
  booking.payment.status = "REFUNDED";
  booking.cancelledAt = new Date().toISOString();
  res.json(booking);
});

/* ------------------------------ fallbacks ------------------------------ */
app.use("/api", (_req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => console.log(`🎬 Movie Booking API running on http://localhost:${PORT}`));
