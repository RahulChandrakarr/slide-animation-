"use client";

import { useEffect, useRef, useState } from "react";

type ParallaxCard = {
  id: number;
  title: string;
  description: string;
  badge: string;
};

const CARDS: ParallaxCard[] = [
  {
    id: 1,
    title: "Interactive UI",
    description: "Smooth parallax motion that responds to your scroll.",
    badge: "01",
  },
  {
    id: 2,
    title: "3D Friendly",
    description: "Designed to sit nicely on top of your 3D background.",
    badge: "02",
  },
  {
    id: 3,
    title: "Responsive Layout",
    description: "Works across mobile, tablet, and desktop screens.",
    badge: "03",
  },
  {
    id: 4,
    title: "Soft Shadows",
    description: "Depth and hierarchy without overwhelming the design.",
    badge: "04",
  },
  {
    id: 5,
    title: "Smooth Transitions",
    description: "Cards glide as you move through the section.",
    badge: "05",
  },
  {
    id: 6,
    title: "Layered Motion",
    description: "Each row moves at a different speed for parallax.",
    badge: "06",
  },
  {
    id: 7,
    title: "Cursor Aware",
    description: "Subtle tilt effect when you hover over the cards.",
    badge: "07",
  },
  {
    id: 8,
    title: "Scroll Story",
    description: "Perfect for showcasing features in a narrative flow.",
    badge: "08",
  },
  {
    id: 9,
    title: "Dynamic Motion",
    description: "Enhanced parallax effects that create depth and engagement.",
    badge: "09",
  },
];

export default function SectionSix() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      // How much of the section has been scrolled through (0 to 1)
      const sectionHeight = rect.height || 1;
      const scrolledInSection = viewportHeight - rect.top;
      const rawProgress = scrolledInSection / (sectionHeight + viewportHeight);
      const clamped = Math.min(1, Math.max(0, rawProgress));

      setScrollProgress(clamped);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Parallax speeds for 9 cards (3 rows x 3 columns)
  // Each row moves at different speeds for better depth effect
  const speeds = [-80, -60, -40, -50, -30, -10, -20, 0, 20];

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center px-4 py-24 sm:px-8"
      style={{ minHeight: "150vh" }}
    >
      <div className="absolute inset-0  from-transparent bg-black" />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-12">
        <div className="max-w-2xl space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
            Section Six
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Parallax Feature
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Card Scroll
            </span>
          </h2>
          <p className="text-sm text-zinc-300 sm:text-base">
            Scroll to see each card move at a different speed, creating a
            layered parallax effect. Perfect for highlighting multiple features
            in a single immersive section.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((card, index) => {
            const speed = speeds[index] ?? 0;
            // Enhanced parallax with smoother easing
            const easedProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);
            const translateY = easedProgress * speed;
            // Add slight rotation based on scroll for more dynamic effect
            const rotation = easedProgress * (speed * 0.05);

            return (
              <div
                key={card.id}
                className="group relative min-h-[280px] rounded-3xl border border-white/10 bg-black/60 p-7 sm:min-h-[340px] sm:p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-4 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-cyan-400/20"
                style={{
                  transform: `translateY(${translateY}px) rotateZ(${rotation}deg)`,
                }}
              >
                <div className="flex h-full flex-col gap-6">
                  {/* Image placeholder */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-purple-500/30 to-pink-500/20">
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200/80">
                      <span className="rounded-full bg-black/40 px-3 py-1">
                        {card.badge}
                      </span>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.25),_transparent_55%)]" />
                  </div>

                  {/* Text + button */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center justify-between text-xs font-medium text-zinc-400">
                        <span className="rounded-full bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                          Feature
                        </span>
                        <span className="text-cyan-400/80 transition-colors group-hover:text-cyan-300">
                          Parallax
                        </span>
                      </div>
                      <h3 className="mb-2 text-2xl font-bold text-white sm:mb-3 sm:text-[1.6rem]">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-cyan-400"
                      >
                        Learn more
                        <span className="text-[0.7rem]">↗</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/0 via-cyan-400/0 to-purple-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-30" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

