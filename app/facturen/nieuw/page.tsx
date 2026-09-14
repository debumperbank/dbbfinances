import { createClient } from "@/lib/supabase/server";
import { maakFactuur } from "../actions";

export default async function NieuweFactuurPage({
  searchParams,
}: {
  searchParams: Promise<{ klus?: string }>;
}) {
  const { klus: klusId } = await searchParams;
  if (!klusId) {
    return <p className="text-sm text-gray-500">Geen klus geselecteerd.</p>;
  }

  const supabase = await createClient();
  const { data: klus } = await supabase
    .from("klussen")
    .select("*, klanten(naam), klus_items(*, klustypes(naam, nummer))")
    .eq("id", klusId)
    .single();

  if (!klus) return <p className="text-sm text-gray-500">Klus niet gevonden.</p>;

  const btw = Number(klus.totaal_bedrag) * 0.21;
  const totaal = Number(klus.totaal_bedrag) + btw;

  async function bevestigen() {
    "use server";
    await maakFactuur(klusId!);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-bold mb-4">Factuur genereren</h1>
      <div className="bg-white rounded-xl shadow-sm border p-5 mb-4">
        <p className="text-sm text-gray-500 mb-1">Klant</p>
        <p className="font-medium mb-4">{klus.klanten?.naam ?? "—"}</p>

        <p className="text-sm text-gray-500 mb-2">Regels</p>
        <ul className="text-sm mb-4 space-y-1">
          {(klus.klus_items ?? []).map((item: any) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.aantal}× #{item.klustypes?.nummer} {item.klustypes?.naam}
              </span>
              <span>€{item.bedrag}</span>
            </li>
          ))}
        </ul>

        <div className="border-t pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotaal</span>
            <span>€{Number(klus.totaal_bedrag).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>BTW (21%)</span>
            <span>€{btw.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base">
            <span>Totaal</span>
            <span>€{totaal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form action={bevestigen}>
        <button
          type="submit"
          className="bg-bumpr-accent text-white rounded-md px-5 py-2.5 text-sm font-medium"
        >
          Factuur genereren
        </button>
      </form>
    </div>
  );
}
