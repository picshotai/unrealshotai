import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Grid, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SocialMediaPreviewProps {
  imageUrl: string | undefined
}

const SocialMediaPreview: React.FC<SocialMediaPreviewProps> = ({ imageUrl }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex-1 px-4 bg-white">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Social Media Preview</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="instagram" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="instagram" className="flex-1">
              Instagram
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex-1">
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex-1">
              Twitter
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex-1">
              LinkedIn
            </TabsTrigger>
          </TabsList>

          {/* Instagram Preview */}
          <TabsContent value="instagram" className="mt-4">
            <div className="bg-black text-white p-4 rounded-lg">
              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt="Instagram preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-white"
                        style={{ objectPosition: "center", objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gray-300 border-2 border-white" />
                    )}
                    <div>
                      <h3 className="font-semibold">UnrealShot AI</h3>
                      <p className="text-sm text-gray-300">@unrealshotai</p>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-white">
                    <Grid className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-300">
                  Photography and videography
                  <br />
                  #1 AI Headshot Generator For Professionals.
                  <br />
                  Next-gen AI headshots! 🚀<br />
                  Professional look, no stress! 😎 ... more
                  <br />
                  <a href="/" className="text-blue-400 hover:underline">
                    🌐 www.unrealshot.com
                  </a>
                </p>
                <div className="flex justify-around w-full text-center">
                  <div>
                    <div className="font-semibold">5</div>
                    <div className="text-sm text-gray-300">Posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">20k</div>
                    <div className="text-sm text-gray-300">Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold">1</div>
                    <div className="text-sm text-gray-300">Following</div>
                  </div>
                </div>
                <button className="w-full py-1.5 rounded bg-zinc-800 text-white hover:bg-zinc-700">Edit profile</button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="whatsapp" className="mt-4">
            <div className="bg-zinc-900 text-white p-4 rounded-lg">
              <div className="mt-4 flex border-b border-zinc-800 pb-2">
                <button className="text-emerald-400 px-4 py-2 flex-1">All</button>
                <button className="px-4 py-2 flex-1">Unread</button>
                <button className="px-4 py-2 flex-1">Favourites</button>
                <button className="px-4 py-2 flex-1">Groups</button>
                <button className="text-emerald-400 px-4 py-2 flex-1">+</button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                {imageUrl ? (
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="WhatsApp preview"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300" />
                )}
                <div>
                  <h3 className="font-semibold">UnrealShot AI</h3>
                  <p className="text-sm text-emerald-400">
                    <a href="/login" className="hover:underline">
                      Let's create an awesome Headshot
                    </a>
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div className="flex-1">
                    <p className="text-sm">Shady Dealer 🤫</p>
                    <p className="text-xs text-gray-400">Bro, I got what you need. Meet me behind the grocery store.</p>
                  </div>
                  <span className="text-xs text-gray-400">11:42</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div className="flex-1">
                    <p className="text-sm">Spam Likely 📢</p>
                    <p className="text-xs text-gray-400">Congrats! You've won a free trip to your living room.</p>
                  </div>
                  <span className="text-xs text-gray-400">20/02/2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div className="flex-1">
                    <p className="text-sm">Bro Who Never Replies 📵</p>
                    <p className="text-xs text-gray-400">"Typing…" (Last seen 2 weeks ago)</p>
                  </div>
                  <span className="text-xs text-gray-400">20/02/2025</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-800" />
                  <div className="flex-1">
                    <p className="text-sm">Bhagwaan Ka Message 📜</p>
                    <p className="text-xs text-gray-400">Agar ye msg 7 logo ko bhejoge toh paisa aayega! 🙏</p>
                  </div>
                  <span className="text-xs text-gray-400">18/02/2025</span>
                </div>
              </div>
              <div className="mt-4 flex justify-around text-sm text-gray-400">
                <button>Chats</button>
                <button>Updates</button>
                <button>Communities</button>
                <button>Calls</button>
              </div>
            </div>
          </TabsContent>

          {/* Twitter Preview */}
          <TabsContent value="twitter" className="mt-4">
            <div className="bg-black text-white p-4 rounded-lg">
              <div className="relative">
                <div className="h-24 rounded-t-lg pattern-twitter" />
                <div className="absolute left-4 -bottom-8">
                  {imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="Twitter preview"
                      className="w-20 h-20 rounded-full object-cover border-2 border-white"
                      style={{ objectPosition: "center", objectFit: "cover" }}
                      onError={(e) => {
                        console.error("Image failed to load:", e)
                        ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/80"
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 border-4 border-black" />
                  )}
                </div>
              </div>
              <div className="mt-12 space-y-4">
                <div className="flex justify-end space-x-2">
                  <button className="px-4 py-1.5 rounded-full border border-gray-600 hover:bg-gray-700">
                    Edit profile
                  </button>
                  <button className="px-4 py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600">Follow</button>
                </div>
                <div>
                  <h3 className="font-bold text-xl">UnrealShot AI</h3>
                  <p className="text-gray-500">@unrealshotai</p>
                  <p className="mt-2 text-sm text-gray-300">
                    Leading AI-powered headshot generator for professionals. 🚀 Creating stunning, next-gen profiles
                    with ease.
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>
                    <b>40</b> Following
                  </span>
                  <span>
                    <b>120k</b> Followers
                  </span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-300" />
                    <span>
                      <b>500</b> Likes
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-gray-300">
                    Recent Tweet: "Transform your professional image with UnrealShot AI – try it now! #AIHeadshots
                    #ProfessionalPhotos"
                  </p>
                  <button className="w-full py-1.5 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                    View Tweets
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* LinkedIn Preview */}
          <TabsContent value="linkedin" className="mt-4">
            <div className="bg-zinc-900 text-white rounded-lg">
              <div className="relative">
                <div className="h-24 rounded-t-lg pattern-linkedin" />
                <div className="absolute left-4 -bottom-8">
                  {imageUrl ? (
                    <img
                      src={imageUrl || "/placeholder.svg"}
                      alt="LinkedIn preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-zinc-100"
                      style={{ objectPosition: "center", objectFit: "cover" }}
                      onError={(e) => {
                        console.error("Image failed to load:", e)
                        ;(e.target as HTMLImageElement).src = "https://via.placeholder.com/96"
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-zinc-900" />
                  )}
                </div>
              </div>
              <div className="p-4 mt-8 space-y-4">
                <div>
                  <h3 className="font-bold text-xl">UnrealShot AI</h3>
                  <p className="text-gray-400 text-sm">AI Headshot Specialist | Photography & Videography</p>
                  <p className="mt-2 text-sm text-gray-300">
                    UnrealShot AI revolutionizes professional headshots with cutting-edge AI technology. Connect to
                    elevate your profile!
                  </p>
                </div>
                <p className="text-blue-400">1,250+ connections</p>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700">Connect</button>
                  <button className="px-4 py-1.5 rounded-full border border-gray-600 hover:bg-gray-800">Message</button>
                  <button className="px-4 py-1.5 rounded-full border border-gray-600 hover:bg-gray-800">More</button>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-sm text-gray-300">Experience: 5+ years in AI-driven photography solutions</p>
                  <p className="text-sm text-gray-300">Education: Master's in Computer Vision, Tech University</p>
                  <button className="w-full py-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700">
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default SocialMediaPreview

