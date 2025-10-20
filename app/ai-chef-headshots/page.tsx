
import { Metadata } from 'next'
import PublicHeader from '@/components/Header'
import { HeroSection } from '@/components/landing/ai-chef-headshots/HeroSection'
import NewHowItWorks from '@/components/landing/NewHowItWorks'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import PremiumComparison from "@/components/landing/Comparison";
import StylePacks from '@/components/landing/StylePacks';
import PricingCards from '@/components/landing/pricing-cards'
import { CTASection } from '@/components/landing/CTASection'
import { commonPageMetadata, generateLandingPageWebApplicationJsonLd } from '@/lib/seo'

import { StructuredData } from '@/components/seo/StructuredData'
import  Footer  from '@/components/MainFooter'
import NicheTestimonialSection from "@/components/landing/NicheTestimonial";
import PrivacySection from "@/components/landing/PrivacySection";
import NicheFAQ from "@/components/landing/NicheFAQ";



const chefTestimonials = [
  {
    quote: "The AI headshots are a game-changer for my restaurant's branding. The quality is exceptional and consistent.",
    name: "Javier Rodriguez",
    role: "Executive Chef, Sabor Moderno",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    quote: "I was skeptical about AI, but these headshots look so natural and professional. Highly recommended for any chef.",
    name: "Isabella Rossi",
    role: "Pastry Chef & Owner, Dolce Vita",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    quote: "Finally, a way to get high-quality headshots without the hassle of a photoshoot. This is a must-have for busy culinary professionals.",
    name: "Kenji Tanaka",
    role: "Sushi Master, Umi",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    quote: "The variety of styles and backgrounds allowed me to create the perfect headshot for my cookbook. I'm thrilled with the results.",
    name: "Priya Sharma",
    role: "Food Blogger & Author",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    quote: "Our entire culinary team uses these AI headshots for their professional profiles. It's a fantastic tool for maintaining a consistent brand image.",
    name: "David Chen",
    role: "Culinary Director, Epicurean Group",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    quote: "I was able to generate a stunning headshot for my portfolio in minutes. The process was simple and the results were outstanding.",
    name: "Aisha Adebayo",
    role: "Private Chef",
    avatar: "/placeholder.svg",
    rating: 5,
  },
];

export const metadata: Metadata = commonPageMetadata.landingPage('ai-chef-headshots')

const chefFAQs = [
  {
    question: "Can I specify the type of chef's uniform in my headshot?",
    answer: "While you can't directly specify the uniform, our AI is trained on a vast dataset of culinary professionals and will generate a variety of appropriate and professional chef's attire.",
  },
  {
    question: "Are there kitchen or restaurant-themed backgrounds available?",
    answer: "Yes, we offer a range of backgrounds suitable for culinary professionals, including professional kitchen settings, restaurant ambiances, and neutral backdrops.",
  },
  {
    question: "Can I upload a photo of myself in my current chef's uniform?",
    answer: "Yes, you can upload a photo in your current uniform. Our AI will use it as a reference to generate a new, high-quality headshot while maintaining a similar style.",
  },
  {
    question: "Will the AI be able to capture the details of my culinary tattoos?",
    answer: "Our AI is designed to capture fine details, including tattoos. For best results, ensure your uploaded photos clearly show the tattoos you want to be included.",
  },
  {
    question: "Can I get a headshot with a specific type of chef's hat?",
    answer: "The AI will generate a variety of common chef's hats. While you can't request a specific type, you will have multiple options to choose from.",
  },
  {
    question: "Is it possible to get a headshot that shows me holding a specific utensil, like a chef's knife?",
    answer: "Currently, our AI focuses on generating professional headshots and does not support the inclusion of specific objects or utensils.",
  },
  {
    question: "Can I use these headshots for my restaurant's menu or website?",
    answer: "Absolutely! You have full commercial rights to your AI-generated headshots and can use them for any promotional materials, including menus, websites, and social media.",
  },
  {
    question: "What if I'm not satisfied with the generated headshots?",
    answer: "We offer a satisfaction guarantee. If you're not happy with the results, you can retry with different photos or contact our support team for assistance.",
  },
  {
    question: "Can I get a group headshot of my entire kitchen staff?",
    answer: "Our AI is currently designed to generate individual headshots. However, we are working on a team feature that will be available in the future.",
  },
  {
    question: "How long does it take to receive my AI chef headshots?",
    answer: "The process is quick and easy. You'll receive your high-quality headshots within minutes of uploading your photos.",
  },
];

export default function AIChefHeadshotsPage() {
  const webAppSchema = generateLandingPageWebApplicationJsonLd('ai-chef-headshots')

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <main>
        <HeroSection />
        <NewHowItWorks />
        <StylePacks />
        <PremiumComparison />
        <NicheTestimonialSection
          testimonials={chefTestimonials}
          title="Real Results from <br /><span class='text-[#ff6f00]'>Real Chefs</span>"
          subtitle="Discover how Unrealshot is helping chefs across the globe elevate their brand."
        />
        
        <PrivacySection />
        <FeaturesSection />
        <PricingCards />
        <NicheFAQ
          faqItems={chefFAQs}
          title="Frequently Asked Questions for <br /><span class='text-[#ff6f00]'>Chefs</span>"
          subtitle="Here are some of the most common questions we get from chefs and culinary professionals."
        />
        <CTASection />
      </main>
      <Footer />
      <StructuredData data={JSON.parse(webAppSchema)} />
    </div>
  )
}