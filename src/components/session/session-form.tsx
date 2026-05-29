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
      title="Edit Session Log"
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
        <span className="text-sm font-medium">Raw log</span>
        <textarea
          className="min-h-56 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={session?.raw_log ?? ""}
          name="raw_log"
        />
      </label>

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
