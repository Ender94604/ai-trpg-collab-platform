"use client";

import { useState, useTransition } from "react";
import type { SessionSummary } from "@/lib/ai/summary-types";
import { normalizeSessionSummary } from "@/lib/ai/summary-types";

type SessionSummaryPanelProps = {
  campaignId: string;
  canGenerate: boolean;
  initialSummary: unknown | null;
  sessionId: string;
};

export function SessionSummaryPanel({
  campaignId,
  canGenerate,
  initialSummary,
  sessionId,
}: SessionSummaryPanelProps) {
  const [summary, setSummary] = useState<SessionSummary | null>(
    initialSummary ? normalizeSessionSummary(initialSummary) : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function generateSummary() {
    setError(null);
    startTransition(async () => {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId, sessionId }),
      });

      const payload = (await response.json()) as {
        error?: string;
        summary?: unknown;
      };

      if (!response.ok || payload.error) {
        setError(payload.error || "Failed to generate summary.");
        return;
      }

      setSummary(normalizeSessionSummary(payload.summary));
    });
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">AI Summary</h2>
          <p className="text-sm text-zinc-600">
            Structured recap saved on this Session.
          </p>
        </div>
        {canGenerate ? (
          <button
            className="w-fit rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isPending}
            onClick={generateSummary}
            type="button"
          >
            {isPending ? "Generating..." : "Generate Summary"}
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {summary ? (
        <div className="grid gap-4 text-sm">
          <SummarySection title="Overview" values={[summary.overview]} />
          <SummarySection title="Clues" values={summary.clues} />
          <SummarySection title="Decisions" values={summary.decisions} />
          <SummarySection title="NPC Changes" values={summary.npcChanges} />
          <SummarySection
            title="Open Questions"
            values={summary.openQuestions}
          />
          <SummarySection
            title="Next Session Tips"
            values={summary.nextSessionTips}
          />
        </div>
      ) : (
        <div className="rounded-md bg-zinc-100 p-4 text-sm text-zinc-700">
          AI summary has not been generated yet.
        </div>
      )}
    </section>
  );
}

function SummarySection({
  title,
  values,
}: {
  title: string;
  values: string[];
}) {
  return (
    <section>
      <h3 className="font-semibold">{title}</h3>
      {values.length > 0 ? (
        <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-700">
          {values.map((value, index) => (
            <li key={`${title}-${index}`}>{value}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-zinc-600">None recorded.</p>
      )}
    </section>
  );
}
