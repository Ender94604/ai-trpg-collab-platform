"use client";

import { useActionState } from "react";
import {
  createSessionAction,
  type SessionFormState,
  updateSessionAction,
} from "@/app/actions/sessions";
import type { SessionDetail } from "@/lib/db/sessions";

const initialState: SessionFormState = {
  error: null,
  success: null,
};

type CreateSessionFormProps = {
  campaignId: string;
};

type EditSessionFormProps = {
  session: SessionDetail;
};

export function CreateSessionForm({ campaignId }: CreateSessionFormProps) {
  const [state, formAction, pending] = useActionState(
    createSessionAction,
    initialState,
  );

  return (
    <SessionFields
      action={formAction}
      hiddenFields={<input name="campaign_id" type="hidden" value={campaignId} />}
      pending={pending}
      state={state}
      submitLabel="Create Session"
      title="Create Session"
    />
  );
}

export function EditSessionForm({ session }: EditSessionFormProps) {
  const [state, formAction, pending] = useActionState(
    updateSessionAction,
    initialState,
  );

  return (
    <SessionFields
      action={formAction}
      hiddenFields={
        <>
          <input name="campaign_id" type="hidden" value={session.campaign_id} />
          <input name="session_id" type="hidden" value={session.id} />
        </>
      }
      pending={pending}
      session={session}
      state={state}
      submitLabel="Save Session"
      title="Edit Session"
    />
  );
}

function SessionFields({
  action,
  hiddenFields,
  pending,
  session,
  state,
  submitLabel,
  title,
}: {
  action: (payload: FormData) => void;
  hiddenFields: React.ReactNode;
  pending: boolean;
  session?: SessionDetail;
  state: SessionFormState;
  submitLabel: string;
  title: string;
}) {
  return (
    <form
      action={action}
      className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
    >
      {hiddenFields}
      <h2 className="text-lg font-semibold">{title}</h2>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Title</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={session?.title ?? ""}
          name="title"
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Session date</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={session?.session_date ?? ""}
          name="session_date"
          type="date"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">GM Notes / Session Prep</span>
        <textarea
          className="min-h-40 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={session?.gm_notes ?? ""}
          name="gm_notes"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Session Transcript</span>
        <textarea
          className="min-h-56 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={session?.transcript ?? ""}
          name="transcript"
        />
        <span className="text-xs text-zinc-500">
          In this MVP, paste the actual session transcript here. In a future
          version, this can be generated from voice transcription.
        </span>
      </label>

      {session?.raw_log && !session.transcript ? (
        <section className="rounded-md border border-amber-200 bg-amber-50 p-4">
          <h3 className="text-sm font-semibold text-amber-900">
            Legacy raw_log
          </h3>
          <p className="mt-1 text-xs text-amber-800">
            This older Session has legacy raw_log data. Copy it into Session
            Transcript if it represents the actual play record.
          </p>
          <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap text-xs text-amber-950">
            {session.raw_log}
          </pre>
        </section>
      ) : null}

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? (
        <p className="text-sm text-emerald-700">{state.success}</p>
      ) : null}

      <button
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
