import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function KlussenPage() {
  const supabase = await createClient();
  const { data: klussen } = await supabase
    .from("klussen")
    .select("*, klanten(naam)")
    .order("datum", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Klussen</h1>
        <Link
          href="/klussen/nieuw"
          className="bg-bumpr-accent text-white text-sm rounded-md px-4 py-2 font-medium"
        >
          + Nieuwe klus
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Datum</th>
              <th className="px-4 py-2">Klant</th>
              <th className="px-4 py-2">Uren</th>
              <th className="px-4 py-2">Bedrag</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {(klussen ?? []).map((k: any) => (
              <tr key={k.id} className="border-t">
                <td className="px-4 py-2">{k.datum}</td>
                <td className="px-4 py-2">{k.klanten?.naam ?? "—"}</td>
                <td className="px-4 py-2">{k.totaal_uren} u</td>
                <td className="px-4 py-2">€{k.totaal_bedrag}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs rounded-full px-2 py-1 ${
                      k.status === "voldaan"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {k.status}
                  </span>
                </td>
              </tr>
            ))}
            {(!klussen || klussen.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nog geen klussen gelogd.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
