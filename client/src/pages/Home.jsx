import { Link } from "react-router-dom";
import Movies from "./Movies";

export default function Home() {
  return (
    <div>
      <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 to-orange-500 px-6 py-10 text-white sm:px-10 sm:py-14">
        <h1 className="text-3xl font-extrabold sm:text-5xl">Book your next movie night 🍿</h1>
        <p className="mt-3 max-w-xl text-white/90 sm:text-lg">
          Pick a movie, choose your theatre and show, select the best seats and pay in seconds.
        </p>
        <Link
          to="/theatres"
          className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 font-semibold text-brand-600 shadow hover:bg-rose-50"
        >
          Browse theatres
        </Link>
      </section>
      <Movies />
    </div>
  );
}
