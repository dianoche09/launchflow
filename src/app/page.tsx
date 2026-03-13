import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50">
      <main className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl text-zinc-900 mb-6">
          Launch your startup to 80+ platforms automatically
        </h1>
        <p className="text-xl text-zinc-600 mb-8 max-w-2xl mx-auto">
          Stop filling launch forms manually. Submit your startup to Product Hunt, AI directories, SaaS reviews, and communities everywhere with one click.
        </p>

        <div className="flex gap-4 justify-center items-center mb-16">
          <Link
            href="/login"
            className="px-8 py-4 bg-zinc-900 text-white rounded-lg font-bold text-lg hover:bg-zinc-800 transition shadow-lg"
          >
            Start Launching Free
          </Link>
          <a
            href="#how-it-works"
            className="px-8 py-4 bg-white text-zinc-900 rounded-lg font-bold text-lg hover:bg-gray-50 transition border"
          >
            How it works
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-2">🤖 AI Launch Kit</h3>
            <p className="text-zinc-600 text-sm">
              AI generates your tagline, short pitch, HN description, and optimized metadata.
            </p>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-2">⚡ Automated Submission</h3>
            <p className="text-zinc-600 text-sm">
              Our worker bots submit your startup to 100+ directories using Playwright queues.
            </p>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow-sm">
            <h3 className="font-bold text-xl mb-2">📈 Launch Analytics</h3>
            <p className="text-zinc-600 text-sm">
              Track where your startup is queued, submitted, or successfully approved.
            </p>
          </div>
        </div>
      </main>

      <footer className="mt-24 text-zinc-500 text-sm">
        LaunchFlow © 2026. Build once. Launch everywhere.
      </footer>
    </div>
  )
}
