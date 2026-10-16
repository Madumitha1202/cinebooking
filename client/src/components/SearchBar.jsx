import { useEffect, useRef } from "react";

// Movie search + genre filter. useRef focuses the search field automatically (DOM element reference).
export default function SearchBar({ search, onSearchChange, genres, genre, onGenreChange, onClear }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clear = () => {
    onClear();
    inputRef.current?.focus(); // keep the cursor in the search box after clearing
  };

  return (
    <section className="card p-4" aria-label="Search and filter movies">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true">
            🔍
          </span>
          <input
            ref={inputRef}
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by movie or actor..."
            aria-label="Search movies"
            className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-rose-200"
          />
        </div>
        <button
          type="button"
          onClick={clear}
          className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          Clear
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Genres">
        {genres.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onGenreChange(g)}
            aria-pressed={g === genre}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              g === genre ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </section>
  );
}
