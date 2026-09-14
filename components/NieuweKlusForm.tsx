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
  vast_bedrag: number | null;
  recyclagepremie: boolean;
  recyclagepremie_bedrag: number;
};

type Klant = { id: string; naam: string };

type Regel = {
  klustype: Klustype;
  aantal: number;
  uren: number;
  bedrag: number;
  recyclagepremie_bedrag: number;
};

export default function NieuweKlusForm({
  klustypes,
  klanten,
}: {
  klustypes: Klustype[];
  klanten: Klant[];
}) {
  const router = useRouter();
  const supabase = createClient();

  const [nummerInput, setNummerInput] = useState("");
  const [regels, setRegels] = useState<Regel[]>([]);
  const [klantId, setKlantId] = useState<string>("");
  const [nieuweKlantNaam, setNieuweKlantNaam] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function voegNummerToe(e: React.FormEvent) {
    e.preventDefault();
    const nummer = Number(nummerInput);
    const type = klustypes.find((k) => k.nummer === nummer);
    if (!type) {
      setError(`Geen klustype gevonden met nummer ${nummer}`);
      return;
    }
    setError(null);
    setRegels((prev) => {
      const bestaand = prev.find((r) => r.klustype.id === type.id);
      if (bestaand) {
        return prev.map((r) =>
          r.klustype.id === type.id ? { ...r, aantal: r.aantal + 1 } : r
        );
      }
      const bedrag = type.vast_bedrag ?? type.standaard_uren * type.uurtarief;
      return [
        ...prev,
        {
          klustype: type,
          aantal: 1,
          uren: type.standaard_uren,
          bedrag,
          recyclagepremie_bedrag: type.recyclagepremie
            ? type.recyclagepremie_bedrag
            : 0,
        },
      ];
    });
    setNummerInput("");
  }

  function verwijderRegel(id: string) {
    setRegels((prev) => prev.filter((r) => r.klustype.id !== id));
  }

  const totaalUren = regels.reduce((s, r) => s + r.uren * r.aantal, 0);
  const totaalBedrag = regels.reduce(
    (s, r) => s + r.bedrag * r.aantal + r.recyclagepremie_bedrag * r.aantal,
    0
  );

  async function opslaan() {
    if (regels.length === 0) {
      setError("Voeg minstens één klustype toe.");
      return;
    }
    setSaving(true);
    setError(null);

    let finalKlantId = klantId;
    if (!finalKlantId && nieuweKlantNaam.trim()) {
      const { data: nieuweKlant, error: klantError } = await supabase
        .from("klanten")
        .insert({ naam: nieuweKlantNaam.trim() })
        .select()
        .single();
      if (klantError) {
        setError("Kon klant niet aanmaken.");
        setSaving(false);
        return;
      }
      finalKlantId = nieuweKlant.id;
    }

    const { data: klus, error: klusError } = await supabase
      .from("klussen")
      .insert({
        klant_id: finalKlantId || null,
        totaal_uren: totaalUren,
        totaal_bedrag: totaalBedrag,
        boekjaar: new Date().getFullYear(),
      })
      .select()
      .single();

    if (klusError || !klus) {
      setError("Kon klus niet opslaan.");
      setSaving(false);
      return;
    }

    const items = regels.map((r) => ({
      klus_id: klus.id,
      klustype_id: r.klustype.id,
      aantal: r.aantal,
      uren: r.uren,
      bedrag: r.bedrag,
      recyclagepremie_bedrag: r.recyclagepremie_bedrag,
    }));
    await supabase.from("klus_items").insert(items);

    setSaving(false);
    router.push("/klussen");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Klant */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <label className="block text-xs text-gray-500 mb-1">Klant</label>
        <select
          value={klantId}
          onChange={(e) => setKlantId(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm mb-2"
        >
          <option value="">— Nieuwe klant —</option>
          {klanten.map((k) => (
            <option key={k.id} value={k.id}>
              {k.naam}
            </option>
          ))}
        </select>
        {!klantId && (
          <input
            type="text"
            placeholder="Naam nieuwe klant"
            value={nieuweKlantNaam}
            onChange={(e) => setNieuweKlantNaam(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />
        )}
      </div>

      {/* Numeriek menu */}
      <div className="bg-white rounded-xl shadow-sm border p-5">
        <p className="text-xs text-gray-500 mb-3">Beschikbare klustypes</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {klustypes.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setNummerInput(String(k.nummer))}
              className="text-xs border rounded-full px-3 py-1 hover:border-bumpr-accent hover:text-bumpr-accent"
            >
              <span className="font-mono font-bold">{k.nummer}</span> — {k.naam}
            </button>
          ))}
        </div>

        <form onSubmit={voegNummerToe} className="flex gap-2">
          <input
            type="number"
            inputMode="numeric"
            autoFocus
            placeholder="Nummer"
            value={nummerInput}
            onChange={(e) => setNummerInput(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-32 text-center text-lg font-mono"
          />
          <button
            type="submit"
            className="bg-bumpr-accent text-white text-sm rounded-md px-4 py-2 font-medium"
          >
            Toevoegen
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Regels */}
      {regels.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Klustype</th>
                <th className="px-4 py-2">Aantal</th>
                <th className="px-4 py-2">Uren</th>
                <th className="px-4 py-2">Bedrag</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {regels.map((r) => (
                <tr key={r.klustype.id} className="border-t">
                  <td className="px-4 py-2 font-mono">{r.klustype.nummer}</td>
                  <td className="px-4 py-2">{r.klustype.naam}</td>
                  <td className="px-4 py-2">{r.aantal}×</td>
                  <td className="px-4 py-2">{(r.uren * r.aantal).toFixed(2)} u</td>
                  <td className="px-4 py-2">
                    €{(r.bedrag * r.aantal + r.recyclagepremie_bedrag * r.aantal).toFixed(2)}
                    {r.recyclagepremie_bedrag > 0 && (
                      <span className="text-xs text-gray-400">
                        {" "}
                        (incl. €{r.recyclagepremie_bedrag} recyclagepremie)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => verwijderRegel(r.klustype.id)}
                      className="text-xs text-gray-400 hover:text-red-600"
                    >
                      verwijderen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t bg-gray-50 font-semibold">
                <td colSpan={3} className="px-4 py-2 text-right">
                  Totaal
                </td>
                <td className="px-4 py-2">{totaalUren.toFixed(2)} u</td>
                <td className="px-4 py-2">€{totaalBedrag.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button
        onClick={opslaan}
        disabled={saving}
        className="bg-bumpr text-white rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50"
      >
        {saving ? "Opslaan..." : "Klus opslaan"}
      </button>
    </div>
  );
}
