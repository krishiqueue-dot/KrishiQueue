import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { Congestion } from "@/components/sections/Congestion";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LiveQueue } from "@/components/sections/LiveQueue";
import { Problem } from "@/components/sections/Problem";
import { ProblemFilm } from "@/components/sections/ProblemFilm";
import { PrototypeLab } from "@/components/sections/PrototypeLab";
import { Roadmap } from "@/components/sections/Roadmap";
import { Solution } from "@/components/sections/Solution";

export default function App() {
  return (
    // "user" makes every motion component honour prefers-reduced-motion
    // without each one having to opt in.
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen">
        <Nav />
        <main>
          {/* The judge's path: problem -> solution -> mechanism -> proof -> scale */}
          <Hero />
          <ProblemFilm />
          <Problem />
          <Solution />
          <HowItWorks />
          <LiveQueue />
          <PrototypeLab />
          <Congestion />
          <Roadmap />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
