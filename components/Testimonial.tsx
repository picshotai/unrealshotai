"use client";
import React from 'react';
import { ThumbsUp, Shield, Lock, LucideIcon, Sparkles } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactElement<LucideIcon>;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg border border-border">
    {icon}
    <h3 className="text-lg font-semibold mt-4 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

interface TestimonialCardProps {
  imageSrc: string;
  name: string;
  quote: string;
}


const FourthSection: React.FC = () => {
  return (
    <div className="w-full max-w-6xl relative mx-auto px-4 md:px-0 py-16 sm:py-24 ">
     

      
<h2 className="text-4xl md:text-6xl font-bold text-navy-900 mb-6 text-center">We Might Not Be Perfect.<span className="block mt-2 text-indigo-800"> But We're The Best.</span></h2>      
<p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto  text-center">Founded in India, with a commitment to protecting your privacy at every step.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <FeatureCard 
          icon={<ThumbsUp className="text-green-500" size={24} />}
          title="Look Your Best in Every Shot"
          description="Our AI enhances your natural features, creating professional ai images that showcase your best self—perfect for any platform."
        />
        <FeatureCard 
          icon={<Shield className="text-blue-500" size={24} />}
          title="Flexible Credits, No Subscriptions"
          description="Buy credits when you need them. No subscriptions, no hidden fees, and you have full ownership of your photos."
        />
        <FeatureCard 
          icon={<Lock className="text-purple-500" size={24} />}
          title="We Respect Your Privacy"
          description="Your privacy matters. All your photos are deleted after 7 days, or you can delete them instantly whenever you want. We’ll never sell or share your data."
        />
      </div>
      
 
      <div className="text-center relative">
        <div className="inline-block relative">
          <a href="/buy-credits" className="flex items-center justify-center bg-gradient-to-r from-indigo-800 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded text-lg shadow-lg hover:bg-indigo-800 transition-all duration-300 group">
                Choose Your Photoshoot Package
                <Sparkles className="ml-2 group-hover:rotate-12 transition-transform duration-300" />
              </a>
          <p className="text-gray-600 italic text-sm 
                        md:absolute md:transform md:rotate-6 md:-right-52 md:top-1/2 md:-translate-y-1/2 md:w-48
                        sm:static sm:mt-2 sm:transform-none sm:rotate-0 sm:text-center sm:w-auto">
            If you're not happy, we will refund your full money
          </p>
        </div>
      </div>
  
    </div>
  );
};

export default FourthSection;
