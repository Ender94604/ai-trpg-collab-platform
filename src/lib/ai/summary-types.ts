export type SessionSummary = {
  overview: string;
  clues: string[];
  decisions: string[];
  npcChanges: string[];
  openQuestions: string[];
  nextSessionTips: string[];
};

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
}

export function normalizeSessionSummary(value: unknown): SessionSummary {
  const source = value && typeof value === "object" ? value : {};
  const record = source as Record<string, unknown>;

  return {
    overview:
      typeof record.overview === "string" ? record.overview : "No overview.",
    clues: normalizeStringArray(record.clues),
    decisions: normalizeStringArray(record.decisions),
    npcChanges: normalizeStringArray(record.npcChanges),
    openQuestions: normalizeStringArray(record.openQuestions),
    nextSessionTips: normalizeStringArray(record.nextSessionTips),
  };
}
