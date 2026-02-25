"use client";

import { FormEvent, useRef, useState } from "react";

export default function ContactSection() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * -10;
    const rotateY = ((x - rect.width / 2) / rect.width) * 12;

    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      "rotateX(0deg) rotateY(0deg) translateY(0px)";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you would send the data to an API here.
  };

  return (
    <section className="relative overflow-hidden bg-[#020617] py-20 text-zinc-100 sm:py-28">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0),_rgba(15,23,42,1))]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14 px-6 md:flex-row md:items-stretch md:px-10 lg:px-12">
        {/* Left: text + contact details */}
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Section Eight
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Let&apos;s build
            <span className="block bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
              something amazing
            </span>
          </h2>
          <p className="mb-6 max-w-xl text-sm text-zinc-300 sm:text-base">
            Have a project in mind, want to collaborate, or just say hi? Drop
            your details and I&apos;ll get back to you as soon as possible.
          </p>

          <div className="mb-8 grid gap-4 text-sm text-zinc-300 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Email
              </p>
              <p className="mt-1 select-all text-sm text-zinc-100">
                rahul.dev@example.com
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Location
              </p>
              <p className="mt-1 text-sm text-zinc-100">Remote • Open to work</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Availability
              </p>
              <p className="mt-1 text-sm text-zinc-100">
                Taking on new projects from{" "}
                <span className="font-semibold text-cyan-300">this month</span>
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Technologies
              </p>
              <p className="mt-1 text-sm text-zinc-100">
                React • Next.js • Three.js • Tailwind CSS
              </p>
            </div>
          </div>
        </div>

        {/* Right: interactive form card */}
        <div className="flex flex-1 items-center justify-center">
          <div
            ref={cardRef}
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/10 backdrop-blur-md transition-transform duration-200 will-change-transform sm:p-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
                  Contact
                </p>
                <p className="mt-1 text-sm text-zinc-300">
                  I usually reply within 24 hours.
                </p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 opacity-80 shadow-lg shadow-cyan-500/40" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70 focus:bg-black/40"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70 focus:bg-black/40"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Project Type
                </label>
                <select
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70 focus:bg-black/40"
                  defaultValue="portfolio"
                >
                  <option value="portfolio">Portfolio / Personal Site</option>
                  <option value="webapp">Web Application</option>
                  <option value="threejs">3D / Three.js Experience</option>
                  <option value="other">Something Else</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell me a bit about your project or idea..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-400/70 focus:bg-black/40"
                />
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-black shadow-lg shadow-cyan-500/30 transition hover:from-cyan-300 hover:to-emerald-300"
                >
                  Send message
                </button>

                <p className="text-[11px] text-zinc-400">
                  Or reach out directly at{" "}
                  <span className="font-medium text-cyan-300">
                    rahul.dev@example.com
                  </span>
                </p>
              </div>

              {submitted && (
                <p className="pt-2 text-xs font-medium text-emerald-400">
                  Thank you! Your message has been captured locally. In a real
                  project this would be sent to an API or email service.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

