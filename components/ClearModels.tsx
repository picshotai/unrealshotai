// components/ClearModels.tsx
import { Button } from "@/components/ui/button";
import { clearAllModels } from "@/lib/actions/clearModelsAction"; // Server Action

export const dynamic = "force-dynamic";

export default function ClearModels() {
  return (
    <form action={clearAllModels}>
      <Button variant="outline" size="sm" type="submit">
        Delete all models
      </Button>
    </form>
  );
}