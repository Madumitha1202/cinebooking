import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBookingContext } from "../context/BookingContext";
import Button from "./Button";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/movies", label: "Movies" },
  { to: "/theatres", label: "Theatres" },
  { to: "/bookings", label: "My Bookings" },
];

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-rose-50 text-brand-600" : "text-slate-600 hover:bg-slate-100"
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { seatCount, clearBooking } = useBookingContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    clearBooking();
    setOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-extrabold text-brand-500">
          🎬 CineBook
        </Link>

        {/* desktop navigation */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {seatCount > 0 && (
            <Link to="/booking/seats" className="rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-brand-600">
              🎟 {seatCount} seat{seatCount > 1 ? "s" : ""}
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-600">Hi, {user.name.split(" ")[0]}</span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>

        {/* mobile menu button */}
        <button
          className="rounded-md p-2 text-2xl md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* mobile navigation */}
      {open && (
        <div className="border-t px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2" aria-label="Mobile">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">Hi, {user.name.split(" ")[0]}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
