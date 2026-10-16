// In-memory data store (resets when the server restarts).
import bcrypt from "bcryptjs";

export const movies = [
  {
    id: 101,
    title: "Midnight Express",
    genre: "Action",
    rating: 4.5,
    duration: "2h 18m",
    cast: ["Arjun Rao", "Meera Nair", "Dev Patel"],
    description:
      "A retired railway guard must stop a hijacked night train from reaching the border before dawn.",
    color: "from-red-500 to-orange-500",
    emoji: "🚆",
  },
  {
    id: 102,
    title: "Laugh Out Loud",
    genre: "Comedy",
    rating: 4.1,
    duration: "2h 02m",
    cast: ["Karthik Raj", "Priya Menon", "Sathish K"],
    description:
      "Three friends open a stand-up comedy club in a small town and accidentally become famous.",
    color: "from-yellow-400 to-pink-500",
    emoji: "😂",
  },
  {
    id: 103,
    title: "Stellar Drift",
    genre: "Sci-Fi",
    rating: 4.7,
    duration: "2h 41m",
    cast: ["Anika Sharma", "Rohan Das", "Lena Fischer"],
    description:
      "A crew of astronauts discovers a signal from a lost spaceship drifting beyond Neptune.",
    color: "from-indigo-600 to-purple-500",
    emoji: "🚀",
  },
  {
    id: 104,
    title: "Whispers of Love",
    genre: "Romance",
    rating: 3.9,
    duration: "2h 10m",
    cast: ["Nisha Iyer", "Vikram Singh"],
    description:
      "Two strangers exchange letters through a misdelivered mailbox and fall for each other.",
    color: "from-pink-500 to-rose-400",
    emoji: "💌",
  },
  {
    id: 105,
    title: "The Haunted Manor",
    genre: "Horror",
    rating: 4.0,
    duration: "1h 55m",
    cast: ["Ishaan Verma", "Tara Kapoor", "Samuel John"],
    description:
      "A family inherits an old manor and soon realises they are not the only residents.",
    color: "from-gray-800 to-gray-600",
    emoji: "👻",
  },
  {
    id: 106,
    title: "Courtroom Clash",
    genre: "Drama",
    rating: 4.4,
    duration: "2h 25m",
    cast: ["Ravi Shankar", "Divya Bharathi", "Kabir Khan"],
    description:
      "A young lawyer takes on a powerful corporation in a case everyone says is unwinnable.",
    color: "from-teal-600 to-emerald-500",
    emoji: "⚖️",
  },
];

export const theatres = [
  { id: 1, name: "PVR Grand Cinemas", location: "Downtown Mall", basePrice: 200, amenities: ["Dolby Atmos", "Recliners"] },
  { id: 2, name: "INOX Galaxy", location: "City Centre", basePrice: 180, amenities: ["4K Projection", "Food Court"] },
  { id: 3, name: "Cinepolis Square", location: "Riverside Plaza", basePrice: 150, amenities: ["Wheelchair Access", "Parking"] },
];

const SHOW_TIMES = ["10:00 AM", "01:30 PM", "06:00 PM", "09:30 PM"];

// Row tiers: A-B = Premium, C-F = Gold, G-H = Silver
export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_ROW = 10;
export const rowMultiplier = (row) => (["A", "B"].includes(row) ? 1.5 : ["C", "D", "E", "F"].includes(row) ? 1.2 : 1);

export const CONVENIENCE_RATE = 0.05; // 5% convenience fee

export function getShows(theatreId, movieId) {
  const theatre = theatres.find((t) => t.id === Number(theatreId));
  if (!theatre) return [];
  return SHOW_TIMES.map((time, idx) => ({
    id: `${theatre.id}-${movieId}-${idx + 1}`,
    theatreId: theatre.id,
    movieId: Number(movieId),
    time,
    price: theatre.basePrice + idx * 10,
  }));
}

export function findShow(showId) {
  const [theatreId, movieId] = String(showId).split("-");
  return getShows(theatreId, movieId).find((s) => s.id === showId) || null;
}

// showId -> Set of booked seat ids (e.g. "A1")
export const bookedSeats = new Map();
export function getBookedSet(showId) {
  if (!bookedSeats.has(showId)) {
    const set = new Set();
    // Pre-book a few seats so the seat map looks realistic
    ["D4", "D5", "E6", "F2", "G8", "C9"].forEach((s, i) => (Number(showId.split("-")[2]) + i) % 2 === 0 && set.add(s));
    bookedSeats.set(showId, set);
  }
  return bookedSeats.get(showId);
}

export const users = [
  {
    id: 1,
    name: "Demo User",
    email: "demo@movie.com",
    passwordHash: bcrypt.hashSync("Demo@123", 8),
  },
];

export const bookings = [];
let bookingCounter = 1000;
export const nextBookingId = () => `BK${++bookingCounter}`;
let userCounter = 1;
export const nextUserId = () => ++userCounter;
