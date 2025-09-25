// components/ClearModels.tsx
import { Button } from "@/components/ui/button";
import { clearAllModels } from "@/lib/actions/clearModelsAction"; // Import the action

export const dynamic = "force-dynamic";

type ClearAllButtonProps = {
  onClear: () => void;
};

export default function ClearModels({ onClear }: ClearAllButtonProps) {
  // Bind the action with a wrapper to call onClear after success
  const handleSubmit = async () => {
    await clearAllModels(); // Call the Server Action
    onClear(); // Update client-side state
  };

  return (
    <form action={handleSubmit}>
      <Button variant="outline" size="sm" type="submit">
        Clear all
      </Button>
    </form>
  );
}