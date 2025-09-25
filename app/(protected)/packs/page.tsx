import PacksGalleryZone from "@/components/PacksGalleryZone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from '@/utils/supabase/server'; // Updated import from utility

const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

export default async function Index() {
  if (!packsIsEnabled) {
    redirect("/dashboard");
  }

  const supabase = await createClient(); // Use the new utility function with await
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        id="train-model-container"
        className="flex flex-1 flex-col gap-2 px-2"
      >
        <Link href="/dashboard" className="text-sm w-fit">
          <Button variant={"outline"}>
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <Card>
          <CardHeader className="p-3">
            <CardTitle>Unrealshot AI Photoshoot Gallery</CardTitle>
            <CardDescription>
              Choose any style from this gallery to see best version of you.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid p-3 pt-0 gap-6">
            <PacksGalleryZone />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

