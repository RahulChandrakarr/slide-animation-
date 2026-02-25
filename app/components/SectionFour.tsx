"use client";

export default function SectionFour() {
  return (
    <section className="relative min-h-screen bg-transparent">
      <div className="flex min-h-screen flex-col items-center justify-center px-8 py-16 text-center md:px-16">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-purple-400">
          Section Four
        </p>
        <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Interactive
          <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Background
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-zinc-300 sm:text-xl">
          Experience a shared interactive background that spans multiple sections.
          Move your mouse to see the floating geometric shapes react and dance
          with your cursor.
        </p>
        <ul className="mt-8 space-y-3 text-zinc-400">
          <li className="flex items-center justify-center gap-2">
            <span className="text-purple-400">→</span>
            Shared background animation
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-purple-400">→</span>
            Mouse-reactive geometric shapes
          </li>
          <li className="flex items-center justify-center gap-2">
            <span className="text-purple-400">→</span>
            Continuous floating motion
          </li>
        </ul>
      </div>
    </section>
  );
}
