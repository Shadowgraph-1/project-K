import { Link } from "react-router-dom"
import video404 from "../../assets/404page/404video.mp4"
import page404 from "../../assets/404page/404page.png"

function NotFoundPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-black">
      <video
        src={video404}
        poster={page404}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-dvh items-end justify-center px-4 pb-8 text-center sm:pb-12">
        <section
          aria-labelledby="not-found-title"
          className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-white/20 bg-white/30 px-6 py-6 shadow-2xl shadow-black/25 backdrop-blur-md"
        >
          <h1
            id="not-found-title"
            className="text-3xl font-bold text-neutral-950"
          >
            Страница потерялась
          </h1>

          <Link
            to="/"
            className="inline-flex rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
          >
            На главную
          </Link>
        </section>
      </div>
    </main>
  )
}

export default NotFoundPage