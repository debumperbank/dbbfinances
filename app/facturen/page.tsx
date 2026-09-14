import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function FacturenPage() {
  const supabase = await createClient();
  const { data: facturen } = await supabase
    .from("facturen")
    .select("*, klanten(naam)")
    .order("datum", { ascending: false });

  const { data: openKlussen } = await supabase
    .from("klussen")
    .select("id, datum, totaal_bedrag, klanten(naam)")
    .eq("status", "open");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold mb-4">Facturen</h1>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-4 py-2">Nr.</th>
                <th className="px-4 py-2">Klant</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Totaal</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(facturen ?? []).map((f: any) => (
                <tr key={f.id} className="border-t">
                  <td className="px-4 py-2 font-mono">{f.factuurnummer}</td>
                  <td className="px-4 py-2">{f.klanten?.naam ?? "—"}</td>
                  <td className="px-4 py-2">{f.datum}</td>
                  <td className="px-4 py-2">€{f.totaal}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`text-xs rounded-full px-2 py-1 ${
                        f.status === "voldaan"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!facturen || facturen.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                    Nog geen facturen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="font-semibold text-sm mb-3">
          Klussen zonder factuur — direct factureren
        </h2>
        <div className="space-y-2">
          {(openKlussen ?? []).map((k: any) => (
            <div
              key={k.id}
              className="bg-white rounded-xl border p-4 flex items-center justify-between text-sm"
            >
              <div>
                <p className="font-medium">{k.klanten?.naam ?? "Onbekende klant"}</p>
                <p className="text-gray-400 text-xs">
                  {k.datum} — €{k.totaal_bedrag}
                </p>
              </div>
              <Link
                href={`/facturen/nieuw?klus=${k.id}`}
                className="bg-bumpr-accent text-white rounded-md px-3 py-1.5 text-xs font-medium"
              >
                Factuur maken
              </Link>
            </div>
          ))}
          {(!openKlussen || openKlussen.length === 0) && (
            <p className="text-sm text-gray-400">
              Alle klussen zijn al gefactureerd.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
