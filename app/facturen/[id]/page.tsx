// app/facturen/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PrintButton from "./PrintButton";

export default async function FactuurDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Haal de factuur op inclusief de gekoppelde klus, klant en klus-items
  const { data: factuur } = await supabase
    .from("facturen")
    .select(
      "*, klussen(*, klanten(*), klus_items(*, klustypes(naam, nummer)))"
    )
    .eq("id", id)
    .single();

  if (!factuur) {
    notFound();
  }

  const klus = factuur.klussen;
  const klant = klus?.klanten;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-sm border rounded-xl print:shadow-none print:border-none print:max-w-none print:p-0">
      {/* Actieknoppen bovenin (verborgen tijdens afdrukken) */}
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-xl font-bold">Factuur #{factuur.factuurnummer || factuur.id.slice(0, 8)}</h1>
        <PrintButton />
      </div>

      {/* --- FACTUUR HEADER --- */}
      <div className="flex justify-between border-b pb-6 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">FACTUUR</h2>
          <p className="text-sm text-gray-500">Factuurnummer: #{factuur.factuurnummer || factuur.id.slice(0, 8)}</p>
          <p className="text-sm text-gray-500">Datum: {new Date(factuur.datum).toLocaleDateString("nl-NL")}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-800">De Bumperbank/BUMPR</p>
          <p className="text-sm text-gray-500">Adresregel 1</p>
          <p className="text-sm text-gray-500">KvK: 12345678 | BTW: NL000000000B01</p>
        </div>
      </div>

      {/* --- KLANT GEGEVENS --- */}
      <div className="mb-8">
        <p className="text-xs uppercase font-semibold text-gray-400 mb-1">Factuur voor:</p>
        <p className="font-medium text-gray-800">{klant?.naam ?? "Onbekende klant"}</p>
        {klant?.adres && <p className="text-sm text-gray-600">{klant.adres}</p>}
        {klant?.email && <p className="text-sm text-gray-600">{klant.email}</p>}
      </div>

      {/* --- FACTUURREGELS --- */}
      <table className="w-full text-left border-collapse mb-8 text-sm">
        <thead>
          <tr className="border-b bg-gray-50 print:bg-transparent">
            <th className="py-2 px-3 font-semibold text-gray-700">Omschrijving</th>
            <th className="py-2 px-3 font-semibold text-gray-700 text-center">Aantal</th>
            <th className="py-2 px-3 font-semibold text-gray-700 text-right">Bedrag</th>
          </tr>
        </thead>
        <tbody>
          {(klus?.klus_items ?? []).map((item: any) => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-3">
                #{item.klustypes?.nummer} {item.klustypes?.naam}
              </td>
              <td className="py-2 px-3 text-center">{item.aantal}</td>
              <td className="py-2 px-3 text-right">€{Number(item.bedrag).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- TOTALEN --- */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotaal:</span>
            <span>€{Number(factuur.subtotaal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>BTW ({factuur.btw_percentage ?? 21}%):</span>
            <span>€{Number(factuur.btw_bedrag).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Totaal:</span>
            <span>€{Number(factuur.totaal).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}