import type { CampaignOverview } from "@/lib/db/campaigns";
import type { CharacterRecord } from "@/lib/db/characters";
import { jsonbText } from "@/lib/db/characters";
import type { SessionDetail } from "@/lib/db/sessions";
import { normalizeSessionSummary } from "@/lib/ai/summary-types";

type ChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

export function buildSessionSummaryPrompt({
  campaign,
  characters,
  session,
}: {
  campaign: CampaignOverview;
  characters: CharacterRecord[];
  session: SessionDetail;
}) {
  const characterContext =
    characters.length > 0
      ? characters
          .map((character) => {
            return [
              `Name: ${character.name}`,
              `Occupation: ${character.occupation || "N/A"}`,
              `Background: ${character.background || "N/A"}`,
              `Personality: ${character.personality || "N/A"}`,
              `Stats: ${jsonbText(character.stats) || "N/A"}`,
              `Inventory: ${jsonbText(character.inventory) || "N/A"}`,
              `Notes: ${character.notes || "N/A"}`,
            ].join("\n");
          })
          .join("\n\n")
      : "No character cards have been created yet.";

  return `You are a TRPG session recap assistant.

Generate a structured post-session summary for the game master.

Hard requirements:
- Do not invent important facts that do not appear in the raw session log.
- You may organize, classify, and lightly clarify scattered information.
- The output should help the game master quickly review before the next session.
- Use Campaign information and Character cards only as context.
- Return valid JSON only. Do not return Markdown, code fences, or prose outside JSON.
- The JSON object must contain these keys exactly:
  - overview: string
  - clues: string[]
  - decisions: string[]
  - npcChanges: string[]
  - openQuestions: string[]
  - nextSessionTips: string[]

Campaign:
Title: ${campaign.title}
System: ${campaign.system_type || "N/A"}
Description: ${campaign.description || "N/A"}
World setting:
${campaign.world_setting || "N/A"}

Characters:
${characterContext}

Session:
Title: ${session.title}
Date: ${session.session_date || "N/A"}
Raw log:
${session.raw_log}`;
}

export async function generateSessionSummary(prompt: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return {
      summary: null,
      error: "DEEPSEEK_API_KEY is not configured.",
    };
  }

  const baseUrl = (
    process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com"
  ).replace(/\/+$/, "");
  const model = process.env.DEEPSEEK_MODEL || "deepseek-v4-flash";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You produce reliable TRPG session summaries as strict JSON objects.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return {
      summary: null,
      error: `DeepSeek request failed: ${response.status} ${message}`,
    };
  }

  const completion = (await response.json()) as ChatCompletionResponse;
  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    return {
      summary: null,
      error: "DeepSeek returned an empty response.",
    };
  }

  try {
    const parsed = JSON.parse(content) as unknown;
    return {
      summary: normalizeSessionSummary(parsed),
      error: null,
    };
  } catch {
    return {
      summary: null,
      error: "DeepSeek returned invalid JSON.",
    };
  }
}
