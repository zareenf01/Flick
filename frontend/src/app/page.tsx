import { Faq, FinalCta, Footer, Safety } from "@/components/landing/closing";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { MotionCompare } from "@/components/landing/motion-compare";
import { Nav } from "@/components/landing/nav";
import { Outputs } from "@/components/landing/outputs";
import { Reel } from "@/components/landing/reel";
import { SmoothScroll } from "@/components/landing/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Reel />
        <div>
          <HowItWorks />
          <MotionCompare />
          <Outputs />
          <Safety />
          <Faq />
          <FinalCta />
        </div>
      </main>
      <Footer />
    </SmoothScroll>
  );
}
