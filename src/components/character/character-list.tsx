import type { CharacterRecord } from "@/lib/db/characters";
import { jsonbText } from "@/lib/db/characters";
import { EditCharacterForm } from "@/components/character/character-form";

type CharacterListProps = {
  characters: CharacterRecord[];
  currentUserId: string;
};

export function CharacterList({
  characters,
  currentUserId,
}: CharacterListProps) {
  if (characters.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-600">
        No Characters yet. Create the first character card for this Campaign.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {characters.map((character) => {
        const isOwner = character.user_id === currentUserId;

        return (
          <article
            className="space-y-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            key={character.id}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{character.name}</h2>
                <p className="text-sm text-zinc-600">
                  {character.occupation || "No occupation specified."}
                </p>
              </div>
              <span className="w-fit rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                {isOwner ? "Your character" : "Party character"}
              </span>
            </div>

            <div className="grid gap-3 text-sm text-zinc-700">
              <CharacterSection label="Background" value={character.background} />
              <CharacterSection
                label="Personality"
                value={character.personality}
              />
              <CharacterSection
                label="Stats"
                value={jsonbText(character.stats)}
              />
              <CharacterSection
                label="Inventory"
                value={jsonbText(character.inventory)}
              />
              <CharacterSection label="Notes" value={character.notes} />
            </div>

            {isOwner ? <EditCharacterForm character={character} /> : null}
          </article>
        );
      })}
    </div>
  );
}

function CharacterSection({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <section>
      <h3 className="font-medium text-zinc-950">{label}</h3>
      <p className="mt-1 whitespace-pre-wrap">{value || "Not specified."}</p>
    </section>
  );
}
