import Link from "next/link";
import type { SessionListItem } from "@/lib/db/sessions";

type SessionListProps = {
  campaignId: string;
  sessions: SessionListItem[];
};

export function SessionList({ campaignId, sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
        No Sessions yet. GMs can create the first Session log for this Campaign.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {sessions.map((session) => (
        <Link
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-950"
          href={`/campaigns/${campaignId}/sessions/${session.id}`}
          key={session.id}
        >
          <h2 className="text-lg font-semibold">{session.title}</h2>
          <div className="mt-2 flex flex-col gap-1 text-sm text-zinc-600 sm:flex-row sm:gap-4">
            <span>Date: {session.session_date || "Not set"}</span>
            <span>Created: {new Date(session.created_at).toLocaleString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
