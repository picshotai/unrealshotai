import Login from "@/app/login/page";
import ClientSideModel from "@/components/realtime/ClientSideModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/server'; // Updated import from utility
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Index({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient(); // Use the new utility function with await
  const resolvedParams = await params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <Login />;
  }

  const { data: model } = await supabase
    .from("models")
    .select("*")
    .eq("id", Number(resolvedParams.id))
    .eq("user_id", user.id)
    .single();

  if (!model) {
    redirect("/dashboard");
  }

  const { data: images } = await supabase
    .from("images")
    .select("*")
    .eq("modelId", model.id);

  const { data: samples } = await supabase
    .from("samples")
    .select("*")
    .eq("modelId", model.id);

  return (
    <div id="train-model-container" className="w-full h-full mt-4">
      <div className="flex flex-row gap-4">
        <Link href="/dashboard" className="text-xs w-fit">
          <Button variant={"outline"} className="text-xs" size="sm">
            <ArrowLeft className="mr-2" />
            Go Back
          </Button>
        </Link>
        <div className="flex flex-row gap-2 align-middle text-center items-center pb-4">
          <h1 className="text-xl">{model.name}</h1>
          <div>
            <Badge
              variant={model.status === "finished" ? "default" : "secondary"}
              className="text-xs font-medium"
            >
              {model.status === "processing" ? "training" : model.status}
              {model.status === "processing" && (
                <Loader2 className="h-4 w-4 animate-spin ml-2 inline-block" />
              )}
            </Badge>
          </div>
        </div>
      </div>

      <ClientSideModel
        samples={samples ?? []}
        serverModel={model}
        serverImages={images ?? []}
      />
    </div>
  );
}
