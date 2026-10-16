# 🎬 CineBook – Movie Ticket Booking Web Application

Full-stack project covering **Scenario 3** (both experiment sets):

* **Frontend** – React 18 + Vite + React Router + Axios + Zustand + Tailwind CSS
* **Backend** – Node.js + Express REST API with JWT authentication (in-memory data, no database needed)

## Run the project

Requires Node.js 18+.

```bash
npm run setup     # installs root + server + client dependencies
npm run dev       # starts API (http://localhost:5000) and React app (http://localhost:5173)
```

Or run them separately:

```bash
cd server && npm install && npm run dev
cd client && npm install && npm run dev
```

Open **http://localhost:5173**.
Demo login: `demo@movie.com` / `Demo@123` (or register a new account).

## Folder structure

```
server/
  index.js            Express app – auth, movies, theatres, shows, bookings CRUD, JWT middleware
  data.js             In-memory movies, theatres, shows, users, bookings
client/src/
  api/                client.js (Axios + interceptors), services.js (all API calls)
  context/            AuthContext, BookingContext, MoviesContext
  hooks/              useMovies, useBooking (custom hooks)
  store/              bookingStore.js (Zustand + logger/consistency middleware)
  utils/              validators.js, pricing.js
  components/         Header, Footer, SearchBar, MovieList, MovieCard, TheatreList, ShowTiming,
                      SeatSelection, Seat, BookingSummary, Payment, Button, Input, Loading,
                      ErrorMessage, ProtectedRoute, ErrorBoundary
  pages/              Home, Movies, MovieDetail, Theatres, Login, Register, BookingLayout,
                      BookingTheatre, BookingSeats, BookingSummaryPage, Checkout, Bookings, NotFound
```

## Where each experiment is implemented

### Set 1 – React fundamentals
| Experiment | Where |
|---|---|
| **1. React Hooks** (components, useState/useEffect/useRef/useMemo/useCallback, Tailwind) | `components/*`, `hooks/useMovies.js` (useEffect load + filter, useMemo filtered movies), `components/SearchBar.jsx` (**useRef** auto-focus), `hooks/useBooking.js` (useMemo seat count/price/total, useCallback `selectSeat/removeSeat/selectMovie/confirmBooking`) |
| **2. Custom Hooks & Context API** | `hooks/useMovies.js`, `hooks/useBooking.js`, `context/BookingContext.jsx` (shared booking data, no props drilling), localStorage sync via `useEffect` in `useBooking`, conditional messages ("No movies available", "No shows available", "Please select your seats") |
| **3. React Router** | `App.jsx` – routes `/`, `/movies`, `/movie/:id`, `/theatres`, `/booking`, `/checkout`, `/login`, `/bookings`; `Link`/`NavLink` in Header; `useParams` in `MovieDetail`; nested routes + `<Outlet />` in `BookingLayout`; `useNavigate` through the booking steps; controlled + validated payment form in `Checkout` |
| **4. Protected routes, auth, validation, error handling** | `Login.jsx`, `context/AuthContext.jsx`, `components/ProtectedRoute.jsx` (redirects with `<Navigate>`, returns user to requested page after login), `utils/validators.js` (required, email, phone, password, seats, payment), `components/ErrorBoundary.jsx`, reusable `Button/Input/MovieCard/Seat/Loading` |

### Set 2 – API integration
| Experiment | Where |
|---|---|
| **1. REST API integration** | `api/client.js` (Axios), `api/services.js` (Axios + one `fetch` call), async/await everywhere, loading + error states with retry |
| **2. State management** | `store/bookingStore.js` – Zustand global store with custom **middleware** (logger + consistency rules), shared by MovieList, SeatSelection and Checkout |
| **3. CRUD with APIs** | `pages/Bookings.jsx` + `api/services.js`: GET history, POST booking (checkout), PATCH/PUT update, DELETE cancel |
| **4. Authentication & tokens** | JWT login/register API, token stored in `localStorage`, attached by an Axios request interceptor, protected booking/payment/history APIs, logout, 401 / expired-token handling (auto-logout + redirect to login) |

## API summary

| Method | Endpoint | Auth |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | – |
| GET | `/api/auth/me` | ✔ |
| GET | `/api/movies`, `/api/movies/:id`, `/api/theatres` | – |
| GET | `/api/theatres/:id/shows?movieId=` , `/api/shows/:id/seats` | – |
| GET / POST | `/api/bookings` | ✔ |
| GET / PUT / PATCH / DELETE | `/api/bookings/:id` | ✔ |

Pricing: Premium rows (A–B) ×1.5, Gold rows (C–F) ×1.2, Silver rows (G–H) ×1, plus 5% convenience fee.
Max 8 seats per booking. Set `JWT_EXPIRES_IN=10s` before starting the server to test expired-token handling.

## Notes
* Data is stored in memory – it resets when the server restarts.
* Payment is a demo only; card numbers are never stored (only the last 4 digits are kept on the booking).
