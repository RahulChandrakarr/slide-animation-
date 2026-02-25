import HeroSection from "./components/HeroSection";
import WaveSection from "./components/WaveSection";
import ParticleNetworkSection from "./components/ParticleNetworkSection";
import SectionFour from "./components/SectionFour";
import SectionFive from "./components/SectionFive";
import SectionSix from "./components/SectionSix";
import SectionSeven from "./components/SectionSeven";
import ContactSection from "./components/ContactSection";
import SharedBackground from "./components/SharedBackground";

export default function Home() {
  return (
    <div className="relative text-zinc-100">
      <SharedBackground />
      <div className="relative z-10">
        {/* Section 1: Full Screen Orbital Animation */}
        <section className="h-screen">
          <HeroSection />
        </section>

        {/* Section 2: Left Text + Right Wave Animation */}
        <WaveSection />

        {/* Section 3: Left Text + Right Particle Network */}
        <ParticleNetworkSection />

        {/* Section 4: Shared Interactive Background */}
        <SectionFour />

        {/* Section 5: Shared Interactive Background */}
        <SectionFive />

        {/* Section 6: Parallax Cards Scroll */}
        <SectionSix />

        {/* Section 7: 3D Interactive Tech Room */}
        <SectionSeven />

        {/* Section 8: Contact */}
        <ContactSection />
      </div>
    </div>
  );
}
