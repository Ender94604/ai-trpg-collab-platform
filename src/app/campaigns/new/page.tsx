import Link from "next/link";
import { CreateCampaignForm } from "@/components/campaign/create-campaign-form";
import { requireUser } from "@/lib/auth/session";

export default async function NewCampaignPage() {
  await requireUser();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="space-y-2">
          <Link className="text-sm text-zinc-600 hover:text-zinc-950" href="/dashboard">
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold">Create Campaign</h1>
          <p className="text-sm text-zinc-600">
            Start a private Campaign workspace for your TRPG group.
          </p>
        </div>

        <CreateCampaignForm />
      </section>
    </main>
  );
}
