"use client"

// components/ClearModels.tsx
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { clearAllModels } from "@/lib/actions/clearModelsAction" // Server Action
import { toast as sonnerToast } from "sonner"

export const dynamic = "force-dynamic"

export default function ClearModels() {
  const [open, setOpen] = useState(false)

  async function handleDelete(formData: FormData) {
    try {
      console.log("[ClearModels] submitting delete");
      await clearAllModels(formData)
      sonnerToast.success("All models deleted successfully")
      setOpen(false)
    } catch (err: any) {
      console.error("[ClearModels] delete failed:", err)
      sonnerToast.error(err?.message || "Failed to delete models")
    }
  }

  return (
    <div>
      <Button variant="outline" size="sm" type="button" onClick={() => setOpen(true)}>
        Delete all models
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <form action={handleDelete}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all models?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete all your trained models and their samples. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
              <Button type="submit" variant="destructive">Delete</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}