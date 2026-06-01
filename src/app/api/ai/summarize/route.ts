import { NextResponse } from "next/server";
import { buildSessionSummaryPrompt, generateSessionSummary } from "@/lib/ai/summary";
import { getCurrentUser } from "@/lib/auth/session";
import { getCampaignOverviewForCurrentUser } from "@/lib/db/campaigns";
import { getCharactersForCampaign } from "@/lib/db/characters";
import {
  getSessionDetail,
  saveSessionSummary,
} from "@/lib/db/sessions";

type SummarizeRequest = {
  campaignId?: unknown;
  sessionId?: unknown;
};

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json()) as SummarizeRequest;
  const campaignId =
    typeof body.campaignId === "string" ? body.campaignId : null;
  const sessionId = typeof body.sessionId === "string" ? body.sessionId : null;

  if (!campaignId || !sessionId) {
    return NextResponse.json(
      { error: "campaignId and sessionId are required." },
      { status: 400 },
    );
  }

  const { campaign, error: campaignError } =
    await getCampaignOverviewForCurrentUser(campaignId, currentUser.user.id);

  if (campaignError || !campaign) {
    return NextResponse.json(
      { error: campaignError || "Campaign access denied." },
      { status: 403 },
    );
  }

  if (campaign.role !== "gm") {
    return NextResponse.json(
      { error: "Only Campaign GMs can generate AI summaries." },
      { status: 403 },
    );
  }

  const { session, error: sessionError } = await getSessionDetail(
    campaignId,
    sessionId,
    { includePrivateFields: true },
  );

  if (sessionError || !session) {
    return NextResponse.json(
      { error: sessionError || "Session not found." },
      { status: 404 },
    );
  }

  if (!session.transcript?.trim()) {
    return NextResponse.json(
      {
        error:
          "Session transcript is empty. Add the actual session transcript before generating a summary.",
      },
      { status: 400 },
    );
  }

  const { characters, error: charactersError } =
    await getCharactersForCampaign(campaignId);

  if (charactersError) {
    return NextResponse.json({ error: charactersError }, { status: 500 });
  }

  const prompt = buildSessionSummaryPrompt({ campaign, characters, session });
  const { summary, error: aiError } = await generateSessionSummary(prompt);

  if (aiError || !summary) {
    return NextResponse.json(
      { error: aiError || "Failed to generate summary." },
      { status: 500 },
    );
  }

  const { error: saveError } = await saveSessionSummary({
    campaignId,
    createdBy: currentUser.user.id,
    prompt,
    sessionId,
    summary,
  });

  if (saveError) {
    return NextResponse.json({ error: saveError }, { status: 500 });
  }

  return NextResponse.json({ summary });
}
