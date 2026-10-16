import { memo } from "react";

const styles = {
  available: "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-emerald-50 hover:ring-emerald-500",
  selected: "bg-brand-500 text-white ring-1 ring-brand-600",
  booked: "cursor-not-allowed bg-slate-200 text-slate-400 line-through",
};

// A single seat button. status: "available" | "selected" | "booked"
function Seat({ id, status = "available", onToggle }) {
  return (
    <button
      type="button"
      disabled={status === "booked"}
      aria-pressed={status === "selected"}
      aria-label={`Seat ${id} ${status}`}
      onClick={() => onToggle(id)}
      className={`h-7 w-7 rounded-t-lg text-[10px] font-semibold transition sm:h-9 sm:w-9 sm:text-xs ${styles[status]}`}
    >
      {id.slice(1)}
    </button>
  );
}

export default memo(Seat);
