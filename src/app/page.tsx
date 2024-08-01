import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar />
        <Hero />
      </div>
      <div className="pt-16"></div>
    </div>
  );
}
