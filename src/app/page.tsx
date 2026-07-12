import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceWheel from "@/components/ServiceWheel";
import ServicesSection from "@/components/ServicesSection";
import HedgeScrollScene from "@/components/HedgeScrollScene";
import PaintScrollScene from "@/components/PaintScrollScene";
import TilesScrollScene from "@/components/TilesScrollScene";
import FloorScrollScene from "@/components/FloorScrollScene";
import ShedScrollScene from "@/components/ShedScrollScene";
import PathScrollScene from "@/components/PathScrollScene";
import BathScrollScene from "@/components/BathScrollScene";
import KitchenScrollScene from "@/components/KitchenScrollScene";
import LightScrollScene from "@/components/LightScrollScene";
import BeforeAfterSection from "@/components/BeforeAfterSection";
import AboutSection from "@/components/AboutSection";
import ReviewsSection from "@/components/ReviewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import QuickNavSidebar from "@/components/QuickNavSidebar";
import FramePreloader from "@/components/FramePreloader";

export default function Home() {
  return (
    <>
      <Navbar />
      <QuickNavSidebar />
      <FramePreloader />
      <main>
        <Hero />
        <ServiceWheel />
        <ServicesSection />
        <HedgeScrollScene />
        <PaintScrollScene />
        <TilesScrollScene />
        <FloorScrollScene />
        <ShedScrollScene />
        <PathScrollScene />
        <BathScrollScene />
        <KitchenScrollScene />
        <LightScrollScene />
        <BeforeAfterSection />
        <AboutSection />
        <ReviewsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
