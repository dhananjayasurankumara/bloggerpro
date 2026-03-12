import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "@/components/SettingsClient";
import { Settings as SettingsIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login?callbackUrl=/settings");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto mb-16 space-y-4">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary rounded-xl">
                <SettingsIcon className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white">Account Settings</h1>
          </div>
          <p className="text-gray-500 font-medium">Manage your digital identity and subscription preferences.</p>
        </div>

        <SettingsClient />
      </div>
    </div>
  );
}
