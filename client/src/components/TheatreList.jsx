// List of theatres. If `onSelect` is provided the theatres are selectable.
export default function TheatreList({ theatres, selectedId, onSelect }) {
  if (!theatres || theatres.length === 0) {
    return <div className="card p-6 text-center text-slate-500">No theatres available</div>;
  }

  return (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {theatres.map((t) => {
        const selected = t.id === selectedId;
        const content = (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-900">{t.name}</h3>
              {selected && <span className="text-sm font-semibold text-brand-600">✓ Selected</span>}
            </div>
            <p className="mt-1 text-sm text-slate-500">📍 {t.location}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.amenities.map((a) => (
                <span key={a} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  {a}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-600">Tickets from ₹{t.basePrice}</p>
          </>
        );
        return (
          <li key={t.id}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(t)}
                aria-pressed={selected}
                className={`card block w-full p-4 text-left transition hover:shadow-md ${selected ? "ring-2 ring-brand-500" : ""}`}
              >
                {content}
              </button>
            ) : (
              <div className="card p-4">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
