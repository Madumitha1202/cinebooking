export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500" role="status">
      <span className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-brand-500" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
