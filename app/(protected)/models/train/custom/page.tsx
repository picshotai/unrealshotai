import CustomModelTrainingZone from "@/components/CustomModelTrainingZone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft } from "lucide-react";


export default async function CustomModelTrainingPage() {
  return (
    <div className="w-full mx-auto">
      <div id="train-custom-model-container" className="flex flex-1 flex-col gap-2">
        <Link href="/dashboard" className="text-sm w-fit">
          <Button variant={"outline"}>
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
     
         
         
            <CustomModelTrainingZone />
          
      
      </div>
    </div>
  )
}

