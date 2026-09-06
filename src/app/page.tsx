import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";

export default function Home() {
  return (
    <main>
      <div className="site-shell">
        <HeroSection />
        <FeatureSection />
      </div>
    </main>
  );
}
