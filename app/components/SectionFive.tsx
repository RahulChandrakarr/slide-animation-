"use client";

export default function SectionFive() {
  return (
    <section className="relative min-h-screen bg-transparent">
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center md:px-16">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
          Section Five
        </p>
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Seamless
          <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Continuation
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
          The same interactive background flows seamlessly between sections,
          creating a unified visual experience. The geometric shapes continue
          their dance as you scroll.
        </p>
        <ul className="mt-8 space-y-3 text-zinc-400">
          <li className="flex items-center justify-center gap-2">
            <span className="text-cyan-400">→</span>
            Continuous background flow
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-cyan-400">→</span>
            Persistent interactive elements
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-cyan-400">→</span>
            Unified visual experience
          </li>
        </ul>
      </div>
    </section>
  );
}
