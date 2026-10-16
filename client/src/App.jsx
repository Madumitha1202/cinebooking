import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetail from "./pages/MovieDetail";
import Theatres from "./pages/Theatres";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingLayout from "./pages/BookingLayout";
import BookingTheatre from "./pages/BookingTheatre";
import BookingSeats from "./pages/BookingSeats";
import BookingSummaryPage from "./pages/BookingSummaryPage";
import Checkout from "./pages/Checkout";
import Bookings from "./pages/Bookings";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {/* key={pathname}: the boundary resets automatically when the user navigates elsewhere */}
        <ErrorBoundary key={location.pathname}>
          <Routes>
            {/* public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/theatres" element={<Theatres />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* protected routes: /booking, /checkout, /bookings, /payment */}
            <Route element={<ProtectedRoute />}>
              <Route path="/booking" element={<BookingLayout />}>
                <Route index element={<Navigate to="theatre" replace />} />
                <Route path="theatre" element={<BookingTheatre />} />
                <Route path="seats" element={<BookingSeats />} />
                <Route path="summary" element={<BookingSummaryPage />} />
              </Route>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Checkout />} />
              <Route path="/bookings" element={<Bookings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
}
