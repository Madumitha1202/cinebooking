import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="card py-16 text-center">
      <div className="text-6xl">🎞️</div>
      <h1 className="mt-3 text-3xl font-bold">404 – Page not found</h1>
      <p className="mt-1 text-slate-500">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-5 inline-block font-semibold text-brand-600 underline">
        Back to home
      </Link>
    </div>
  );
}
