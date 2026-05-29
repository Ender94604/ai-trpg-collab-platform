"use client";

import { useActionState } from "react";
import type { CharacterRecord } from "@/lib/db/characters";
import {
  createCharacterAction,
  type CharacterFormState,
  updateCharacterAction,
} from "@/app/actions/characters";

const initialState: CharacterFormState = {
  error: null,
  success: null,
};

type CreateCharacterFormProps = {
  campaignId: string;
};

type EditCharacterFormProps = {
  character: CharacterRecord;
};

function jsonbText(value: CharacterRecord["stats"]) {
  return value?.text ?? "";
}

function FormMessage({
  error,
  success,
}: {
  error: string | null;
  success: string | null;
}) {
  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (success) {
    return <p className="text-sm text-emerald-700">{success}</p>;
  }

  return null;
}

export function CreateCharacterForm({ campaignId }: CreateCharacterFormProps) {
  const [state, formAction, pending] = useActionState(
    createCharacterAction,
    initialState,
  );

  return (
    <CharacterFields
      action={formAction}
      hiddenFields={<input name="campaign_id" type="hidden" value={campaignId} />}
      pending={pending}
      state={state}
      submitLabel="Create Character"
      title="Create Character"
    />
  );
}

export function EditCharacterForm({ character }: EditCharacterFormProps) {
  const [state, formAction, pending] = useActionState(
    updateCharacterAction,
    initialState,
  );

  return (
    <CharacterFields
      action={formAction}
      character={character}
      hiddenFields={
        <input name="character_id" type="hidden" value={character.id} />
      }
      pending={pending}
      state={state}
      submitLabel="Save Character"
      title="Edit Your Character"
    />
  );
}

function CharacterFields({
  action,
  character,
  hiddenFields,
  pending,
  state,
  submitLabel,
  title,
}: {
  action: (payload: FormData) => void;
  character?: CharacterRecord;
  hiddenFields: React.ReactNode;
  pending: boolean;
  state: CharacterFormState;
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
        <span className="text-sm font-medium">Name</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character?.name ?? ""}
          name="name"
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Occupation</span>
        <input
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character?.occupation ?? ""}
          name="occupation"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Background</span>
        <textarea
          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character?.background ?? ""}
          name="background"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Personality</span>
        <textarea
          className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character?.personality ?? ""}
          name="personality"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Stats</span>
        <textarea
          className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character ? jsonbText(character.stats) : ""}
          name="stats"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Inventory</span>
        <textarea
          className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character ? jsonbText(character.inventory) : ""}
          name="inventory"
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-950"
          defaultValue={character?.notes ?? ""}
          name="notes"
        />
      </label>

      <FormMessage error={state.error} success={state.success} />

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
