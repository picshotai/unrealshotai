import TrainModelZone from "@/components/TrainModelZone";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const packsIsEnabled = process.env.NEXT_PUBLIC_TUNE_TYPE === "packs";

export default async function Index({ params }: { params: { pack: string } }) {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div id="train-model-container" className="flex flex-1 flex-col gap-4">
        <Link
          href={packsIsEnabled ? "/packs" : "/dashboard"}
          className="text-sm w-fit"
        >
          <Button variant={"outline"}>
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>


        <TrainModelZone packSlug={params.pack} />
      </div>
    </div>
  );
}
