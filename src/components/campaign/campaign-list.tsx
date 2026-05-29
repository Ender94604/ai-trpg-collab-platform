import Link from "next/link";
import type { CampaignListItem } from "@/lib/db/campaigns";

type CampaignListProps = {
  campaigns: CampaignListItem[];
};

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
        No Campaigns yet. Create your first Campaign to start the MVP loop.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {campaigns.map((campaign) => (
        <Link
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-950"
          href={`/campaigns/${campaign.id}`}
          key={campaign.id}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{campaign.title}</h2>
              <p className="text-sm text-zinc-600">
                {campaign.description || "No description yet."}
              </p>
            </div>
            <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium uppercase text-zinc-700">
              {campaign.role}
            </span>
          </div>
          {campaign.system_type ? (
            <p className="mt-3 text-xs text-zinc-500">
              System: {campaign.system_type}
            </p>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
