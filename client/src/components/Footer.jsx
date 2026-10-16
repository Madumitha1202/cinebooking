export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>🎬 CineBook – Movie Ticket Booking</p>
        <p>© {new Date().getFullYear()} CineBook. Built with React, Express &amp; Tailwind CSS.</p>
      </div>
    </footer>
  );
}
