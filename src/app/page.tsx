import Image from "next/image";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans">
      <main className="flex w-full max-w-6xl flex-col py-4 px-8 md:px-2 items-center">
        <HeroSection />
        <FeatureSection />
        <button className="btn">
          <Link href='/compling'>ABC</Link>
        </button>
      </main>
    </div>
  );
}
