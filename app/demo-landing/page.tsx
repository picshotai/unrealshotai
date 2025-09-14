
import AIElephantSection from "@/components/demo-landing/AIElephantSection";
import BentoSection from "@/components/demo-landing/BentoSection";
import FinalCTASection from "@/components/demo-landing/FinalCTASection";
import FounderNoteSection from "@/components/demo-landing/FounderNoteSection";
import HeroSection from "@/components/demo-landing/HeroSection";
import PivotSection from "@/components/demo-landing/PivotSection";
import ProblemSection from "@/components/demo-landing/ProblemSection";
import SolutionSection from "@/components/demo-landing/SolutionSection";
import TechStackSection from "@/components/demo-landing/TechStackSection";
import { WhoItsForSection } from "@/components/demo-landing/WhoItsForSection";
import { OfferSection } from "@/components/demo-landing/OfferSection";
import { Header } from "@/components/PublicHeader"


const UnboilerplateLanding = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <ProblemSection />
      <PivotSection />
      <SolutionSection />
      <AIElephantSection />
      
      
      
      <BentoSection />
      
      <TechStackSection />
      <WhoItsForSection />
      <OfferSection />
      
      
      <FounderNoteSection />
      
      <FinalCTASection />
    </main>
  );
};

export default UnboilerplateLanding;
