import Features from "@/components/home/features";
import Footer from "@/components/home/footer";
import Header from "@/components/home/header";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Hero />
        <Features />
      </div>
      <Footer />
    </div>
  );
}
