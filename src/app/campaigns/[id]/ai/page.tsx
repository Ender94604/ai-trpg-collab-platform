import { CampaignNav } from "@/components/campaign/campaign-nav";

export default async function CampaignAiPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <CampaignNav campaignId={id} />
        <div className="rounded-lg border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-zinc-500">Campaign</p>
          <h1 className="text-3xl font-semibold">AI Assistant</h1>
          <p className="mt-2 text-sm text-zinc-600">
            AI tools for this Campaign will live here.
          </p>
        </div>
      </section>
    </main>
  );
}
