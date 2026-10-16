// Pricing helpers – must match the logic on the server (server/data.js)
export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const SEATS_PER_ROW = 10;
export const MAX_SEATS = 8;
export const CONVENIENCE_RATE = 0.05;

export const rowTier = (row) =>
  ["A", "B"].includes(row) ? "Premium" : ["C", "D", "E", "F"].includes(row) ? "Gold" : "Silver";

export const rowMultiplier = (row) => ({ Premium: 1.5, Gold: 1.2, Silver: 1 }[rowTier(row)]);

export const seatPrice = (show, seatId) => Math.round((show?.price ?? 0) * rowMultiplier(seatId[0]));

export const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
