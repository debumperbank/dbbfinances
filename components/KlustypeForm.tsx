"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Klustype = {
  id: string;
  nummer: number;
  naam: string;
  standaard_uren: number;
  uurtarief: number;
  recyclagepremie: boolean;
  recyclagepremie_bedrag: number;
  actief: boolean;
};

export default function KlustypeForm({ existing }: { existing: Klustype[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nummer: existing.length ? Math.max(...existing.map((k) => k.nummer)) + 1 : 1,
    naam: "",
    standaard_uren: 1,
    uurtarief: 75,
    recyclagepremie: false,
    recyclagepremie_bedrag: 0,
  });

  async function addKlustype(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const { error: insertError } = await supabase.from("klustypes").insert({
      nummer: form.nummer,
      naam: form.naam,
      standaard_uren: form.standaard_uren,
      uurtarief: form.uurtarief,
      recyclagepremie: form.recyclagepremie,
      recyclagepremie_bedrag: form.recyclagepremie_bedrag,
    });

    setSaving(false);

    if (insertError) {
      console.error(insertError);
      setError("Kon klustype niet opslaan: " + insertError.message);
      return;
    }

    setForm({ ...form, nummer: form.nummer + 1, naam: "" });
    router.refresh();
  }

  async function toggleActief(id: string, actief: boolean) {
    const { error: updateError } = await supabase
      .from("klustypes")
      .update({ actief: !actief })
      .eq("id", id);

    if (updateError) {
      console.error(updateError);
      setError("Kon status niet wijzigen: " + updateError.message);
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Naam</th>
              <th className="px-4 py-2">Uren</th>
              <th className="px-4 py-2">Tarief</th>
              <th className="px-4 py-2">Recyclagepremie</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {existing.map((k) => (
              <tr key={k.id} className={"border-t " + (!k.actief ? "opacity-40" : "")}>
                <td className="px-4 py-2 font-mono font-bold">{k.nummer}</td>
                <td className="px-4 py-2">{k.naam}</td>
                <td className="px-4 py-2">{k.standaard_uren} u</td>
                <td className="px-4 py-2">EUR {k.uurtarief}/u</td>
                <td className="px-4 py-2">
                  {k.recyclagepremie ? "EUR " + k.recyclagepremie_bedrag : "-"}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => toggleActief(k.id, k.actief)}
                    className="text-xs text-gray-500 hover:text-bumpr-accent"
                  >
                    {k.actief ? "Deactiveren" : "Activeren"}
                  </button>
                </td>
              </tr>
            ))}
            {existing.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Nog geen klustypes toegevoegd.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form
        onSubmit={addKlustype}
        className="bg-white rounded-xl shadow-sm border p-5 grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <h2 className="col-span-full font-semibold text-sm">Nieuw klustype toevoegen</h2>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Nummer</label>
          <input
            type="number"
            value={form.nummer}
            onChange={(e) => setForm({ ...form, nummer: Number(e.target.value) })}
            className="w-full border rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 mb-1">Naam</label>
          <input
            type="text"
            value={form.naam}
            onChange={(e) => setForm({ ...form, naam: e.target.value })}
            placeholder="bv. Full Detail"
            className="w-full border rounded-md px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Standaard uren</label>
          <input
            type="number"
            step="0.25"
            value={form.standaard_uren}
            onChange={(e) =>
              setForm({ ...form, standaard_uren: Number(e.target.value) })
            }
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Uurtarief (EUR)</label>
          <input
            type="number"
            step="0.5"
            value={form.uurtarief}
            onChange={(e) => setForm({ ...form, uurtarief: Number(e.target.value) })}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        </div>
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            checked={form.recyclagepremie}
            onChange={(e) =>
              setForm({ ...form, recyclagepremie: e.target.checked })
            }
            id="recyclage"
          />
          <label htmlFor="recyclage" className="text-xs text-gray-500">
            Recyclagepremie
          </label>
        </div>
        {form.recyclagepremie && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Bedrag recyclagepremie (EUR)
            </label>
            <input
              type="number"
              step="0.5"
              value={form.recyclagepremie_bedrag}
              onChange={(e) =>
                setForm({
                  ...form,
                  recyclagepremie_bedrag: Number(e.target.value),
                })
              }
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        )}

        {error && (
          <p className="col-span-full text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="col-span-full bg-bumpr-accent text-white rounded-md py-2 text-sm font-medium disabled:opacity-50"
        >
          {saving ? "Opslaan..." : "Klustype toevoegen"}
        </button>
      </form>
    </div>
  );
}