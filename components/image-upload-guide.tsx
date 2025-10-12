"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Camera,
  Info,
  User,
  PersonStanding,
  SplitSquareVertical,
  UserIcon as UserStanding,
} from "lucide-react"

export interface ImageUploadGuideProps {
  className?: string
}

export default function ImageUploadGuide({ className }: ImageUploadGuideProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className={`w-full overflow-x-hidden ${className}`}>
      

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <ScrollArea className="w-full mb-6">
          <TabsList className="mb-3 flex justify-center flex-wrap gap-2 bg-transparent h-auto items-center rounded-md p-1 w-full">
            <TabsTrigger
              value="overview"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <Info className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="facial"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <User className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Facial Expressions
            </TabsTrigger>
            <TabsTrigger
              value="half-body"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <UserStanding className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Half-Body
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <SplitSquareVertical className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="full-body"
              className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              <PersonStanding className="-ms-0.5 me-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
              Full-Body
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="overview" className="mt-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>The Magic Number: 10 Images</CardTitle>
                <CardDescription>You'll need to upload exactly 10 images to train the AI effectively</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="grid grid-cols-5 gap-2 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/selfie2.jpg" alt="Face expressions" fill className="object-cover" />
                      <Badge className="absolute bottom-1 left-1 bg-blue-500">5</Badge>
                    </div>
                    <span className="text-xs text-gray-600">Face</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/vishnuselfie.jpg" alt="Half body" fill className="object-cover" />
                      <Badge className="absolute bottom-1 left-1 bg-blue-500">2</Badge>
                    </div>
                    <span className="text-xs text-gray-600">Half</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/you-man.jpg" alt="Left profile" fill className="object-cover" />
                      <Badge className="absolute bottom-1 left-1 bg-blue-500">1</Badge>
                    </div>
                    <span className="text-xs text-gray-600">Left</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/right-profile.jpg" alt="Right profile" fill className="object-cover" />
                      <Badge className="absolute bottom-1 left-1 bg-blue-500">1</Badge>
                    </div>
                    <span className="text-xs text-gray-600">Right</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/full-body.jpg" alt="Full body" fill className="object-cover" />
                      <Badge className="absolute bottom-1 left-1 bg-blue-500">1</Badge>
                    </div>
                    <span className="text-xs text-gray-600">Full</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>5 facial images with different expressions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>2 half-body shots showing your upper body</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>1 left-side profile and 1 right-side profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>1 full-body image showing your entire physique</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image Quality Tips for Best Results</CardTitle>
                <CardDescription>Follow these guidelines to ensure optimal AI training</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src="/content/good-lighting.png"
                        alt="Good lighting example"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2  flex items-center justify-center bg-green-500/10">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Good lighting</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-2 bg-gray-100 rounded-lg overflow-hidden">
                      <Image src="/content/clean-bg.jpg" alt="Clear background example" fill className="object-cover" />
                      <div className="absolute top-2 left-2  flex items-center justify-center bg-green-500/10">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Clear background</span>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>No Filters:</strong> Skip beauty filters, heavy makeup, and photo effects.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Clear Background:</strong> Use a clean background that won't distract from your features.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Good Lighting:</strong> Natural light is best! Ensure your face and body are well-lit.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>No Accessories:</strong> Avoid hats, sunglasses, or anything that hides your features.
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facial" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>5 Facial Images with Different Expressions</CardTitle>
              <CardDescription>
                Capture your natural expressions to help the AI understand your facial features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { name: "Casual Smile", desc: "A soft, relaxed smile", url: "/content/casual-smile.jpg" },
                  { name: "Confident", desc: "A calm, self-assured look", url: "/content/confident.jpg" },
                  { name: "Serious", desc: "Neutral expression, no smile", url: "/content/serious.jpg" },
                  { name: "Sad", desc: "Slightly downcast expression", url: "/content/sad.jpg" },
                  { name: "Happy", desc: "A big, genuine smile", url: "/content/laughing.jpg" },
                ].map((expression, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="relative w-full aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={expression.url || "/placeholder.svg"}
                        alt={`${expression.name} expression`}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-blue-500">{index + 1}</Badge>
                    </div>
                    <h3 className="font-medium text-gray-900">{expression.name}</h3>
                    <p className="text-sm text-gray-500 text-center mt-1">{expression.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 flex items-start">
                  <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    <strong>Pro Tip:</strong> Make sure your entire face is clearly visible, with no filters,
                    sunglasses, or hats blocking your features.
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="half-body" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>2 Half-Body Shots</CardTitle>
              <CardDescription>These help the AI understand your posture and upper body proportions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { num: 1, url: "/content/vishnuselfie.jpg" },
                  { num: 2, url: "/content/half-body.jpg" },
                ].map((shot) => (
                  <div key={shot.num} className="flex flex-col items-center">
                    <div className="relative w-full max-w-sm aspect-[3/4] mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={shot.url || "/placeholder.svg"}
                        alt={`Half body shot ${shot.num}`}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-3 left-3 bg-blue-500">{shot.num}</Badge>
                    </div>
                    <div className="max-w-sm">
                      <h3 className="font-medium text-gray-900 mb-2">Half-Body Shot {shot.num}</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Stand naturally with a relaxed pose</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Include your face and torso in the frame</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ensure the background is not cluttered</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>2 Profile Images</CardTitle>
              <CardDescription>
                These profile shots help the AI understand your facial structure from different angles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-sm aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src="/content/you-man.jpg" alt="Left profile" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3 bg-blue-500">Left</Badge>
                  </div>
                  <div className="max-w-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Left-Side Profile</h3>
                    <p className="text-gray-600 mb-3">
                      Turn your face slightly to the left to capture your profile from this angle.
                    </p>
                    <div className="flex items-center text-sm text-blue-700">
                      <Camera className="h-4 w-4 mr-1" />
                      <span>Ensure good lighting on this side of your face</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-sm aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src="/content/right-profile.jpg" alt="Right profile" fill className="object-cover" />
                    <Badge className="absolute top-3 left-3 bg-blue-500">Right</Badge>
                  </div>
                  <div className="max-w-sm">
                    <h3 className="font-medium text-gray-900 mb-2">Right-Side Profile</h3>
                    <p className="text-gray-600 mb-3">
                      Turn your face slightly to the right to capture your profile from this angle.
                    </p>
                    <div className="flex items-center text-sm text-blue-700">
                      <Camera className="h-4 w-4 mr-1" />
                      <span>Keep your hair away from your face if possible</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="full-body" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>1 Full-Body Image</CardTitle>
              <CardDescription>
                A full-body shot is essential for AI to capture your body proportions and overall posture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full max-w-xs aspect-[2/3] bg-gray-100 rounded-lg overflow-hidden">
                  <Image src="/content/full-body.jpg" alt="Full body" fill className="object-cover" />
                  <Badge className="absolute top-3 left-3 bg-blue-500">Full Body</Badge>
                </div>

                <div className="max-w-lg">
                  <h3 className="font-medium text-gray-900 mb-3">Full-Body Shot Guidelines</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Stand naturally in well-fitting clothes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Ensure your entire body is visible from head to toe</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Avoid extreme poses – keep it natural and relaxed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Use a plain background if possible</span>
                    </li>
                  </ul>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 flex items-start">
                      <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Why This Matters:</strong> The full-body shot helps the AI understand your overall
                        proportions and posture, allowing it to generate more accurate full-body images of you in
                        various scenarios.
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Why This Image Set Matters</h2>
        <p className="text-gray-700 mb-4">
          Uploading the right mix of images is crucial for getting AI-generated photos that truly resemble you. By
          following this guide, you give the AI all the angles and expressions it needs to create stunning, high-quality
          results.
        </p>
        <p className="text-gray-700 font-medium">
          So, take your time, follow these steps, and get ready to see yourself like never before! 🎯
        </p>
      </div>
    </div>
  )
}

