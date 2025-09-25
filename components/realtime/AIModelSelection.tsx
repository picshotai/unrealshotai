"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Package, User, ArrowRight, Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const AIModelSelection: React.FC = () => {
  return (
    <div className="mt-6 space-y-6 w-full max-w-3xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border rounded-lg bg-white dark:bg-gray-900 shadow-sm px-4">
          <AccordionTrigger className="text-xl font-semibold text-gray-800 dark:text-gray-200 hover:no-underline py-6">
            <div className="flex items-center gap-2 text-sm sm:text-lg">
            <Sparkles className="h-4 w-4" />
              <span>Know the difference between a Pack style model and custom model training</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden"
            >
              <div >
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Both methods require <strong>your selfies</strong> to train a model. The difference? One gives you
                  pre-designed styles, while the other lets you create images using your own prompts.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <ModelOption
                    icon={<Package className="w-8 h-8 text-gray-600 dark:text-gray-400" />}
                    title="Train Pack Model"
                    subtitle="Pre-Styled AI Photos"
                    description="Upload your selfies, and the AI will generate 20 images based on predefined styles. No need to write prompts—just pick a style, and let the AI do the rest."
                    features={[
                      "Best for beginners—no need to write prompts.",
                      "AI uses pre-designed themes (e.g., professional, artistic, fantasy).",
                      "Get 20 AI-generated images after training.",
                      "Cost: 30 Credits (One-time model training)",
                      "Multi-Person Mode: Not available in Pack Model"
                    ]}
                    color="blue"
                  />

                  <ModelOption
                    icon={<User className="w-8 h-8 text-gray-600 dark:text-gray-400" />}
                    title="Train Custom Model"
                    subtitle="Use Your Own Prompts"
                    description="Upload your selfies, train a custom model, and then generate images using any prompt you want. This is for users who want full creative control over their AI-generated images."
                    features={[
                      "Write your own prompts to control the AI's output.",
                      "Generate unlimited images (each costs 1 credit).",
                      "Perfect for unique concepts, custom aesthetics, and creative ideas.",
                      " Cost: 30 Credits (One-time model training)",
                    ]}
                    color="gray"
                  />
               
                </div>
                <ModelOption
                    icon={<User className="w-8 h-8 text-gray-600 dark:text-gray-400" />}
                    title="Multi-Person Mode (Custom Model Only) 👫"
                    subtitle="Train Two Models"
                    description="Want to generate photos with multiple people? With multi-person mode, you can create group or couple images using your trained models."
                    features={[
                      "20 AI Photos for 60 Credits (Multi-person mode costs 1 credits per image).",
                      "Each image with both models together costs 1 credits.",
                      "Works for couples, friends, or group shots with trained models.",
                    ]}
                    color="gray"
                  />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 mt-4  p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What happens next?</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Once trained, your AI model will be <strong>ready to generate images</strong>.
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong>Pack Model</strong>: Instantly receive <strong>20 AI-generated images</strong> in a
                      selected style.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-400">
                      <strong>Custom Model</strong>: Use prompts to create <strong>desired images</strong>.
                    </span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

interface ModelOptionProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  features: string[]
  color: "blue" | "gray"
}

const ModelOption: React.FC<ModelOptionProps> = ({ icon, title, subtitle, description, features, color }) => {
  const baseColor = color === "blue" ? "blue" : "gray"
  const emoji = color === "blue" ? "🔵" : "⚪"

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg mt-4 shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="bg-gray-50 dark:bg-gray-700 p-4 flex items-center gap-3">
        {icon}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
            {title} <span className="text-base">{emoji}</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <ArrowRight className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-2 mt-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AIModelSelection

