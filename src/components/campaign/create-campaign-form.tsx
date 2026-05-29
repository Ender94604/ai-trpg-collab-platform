"use client";

import { useActionState } from "react";
import { createCampaignAction } from "@/app/actions/campaigns";

const initialState = {
  error: null,
};

export function CreateCampaignForm() {
  const [state, formAction, pending] = useActionState(
    createCampaignAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
    >
      <label className="block space-y-1">
        <span className="text-sm font-medium">Title</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          maxLength={80}
          name="title"
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Description</span>
        <textarea
          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          name="description"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">System type</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          name="system_type"
          placeholder="COC, DND, original..."
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">World setting</span>
        <textarea
          className="min-h-32 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          name="world_setting"
        />
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <button
        className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={pending}
        type="submit"
      >
        {pending ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
}
