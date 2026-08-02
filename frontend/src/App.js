import { motion, useScroll, useSpring } from "framer-motion";
import { Toaster } from "sonner";
import "@/App.css";
import useLenis from "./hooks/useLenis";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import Problem from "./components/Problem";
import Solution from "./components/Solution";
import Products from "./components/Products";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Gallery from "./components/Gallery";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[#8BFF00] to-[#65E600] shadow-[0_0_10px_rgba(139,255,0,0.7)]"
      style={{ scaleX }}
    />
  );
};

function App() {
  useLenis();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="noise-overlay" />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Problem />
        <Solution />
        <Products />
        <Features />
        <HowItWorks />
        <Gallery />
        <Stats />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Toaster theme="dark" position="bottom-center" toastOptions={{ style: { background: "#111", border: "1px solid rgba(139,255,0,0.3)", color: "#fff" } }} />
    </div>
  );
}

export default App;
