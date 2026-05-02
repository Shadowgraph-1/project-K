import { Link } from "react-router-dom"
import video404 from "../../assets/404video.mp4"
import page404 from "../../assets/404page.png"

function NotFoundPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-black">
      <video
        src={video404}
        poster={page404}
        className="absolute inset-0 h-full w-full object-cover object-[center_10%]"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 flex min-h-dvh items-end justify-center px-4 pb-8 text-center sm:pb-12">
        <div className="max-w-md rounded-3xl border border-white/20  bg-white/30 px-6 py-5 shadow-2xl shadow-black/25 backdrop-blur-md">

          <h1 className="mt-2 text-3xl font-bold text-neutral-950">
            Страница потерялась
          </h1>

          <Link
            to="/"
            className="mt-5 inline-flex rounded-xl bg-neutral-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  )
}

export default NotFoundPage