import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function PhotoEditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
          <Link href="/gallery" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-black/90">
            {/* Ideally use an icon here, but keeping it minimal to avoid client component imports */}
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="hidden md:inline-block">Back to Dashboard</span>
          </Link>
          <div className="w-24" />
        </div>
      </header>
      <div className="pt-16">{children}</div>
    </div>
  );
}