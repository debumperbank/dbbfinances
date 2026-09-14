import { createClient } from "@/lib/supabase/server";
import NieuweKlusForm from "@/components/NieuweKlusForm";



export default async function NieuweKlusPage() {
  const supabase = await createClient();
  const { data: klustypes } = await supabase
    .from("klustypes")
    .select("*")
    .eq("actief", true)
    .order("nummer");
  const { data: klanten } = await supabase
    .from("klanten")
    .select("id, naam")
    .order("naam");

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Nieuwe klus loggen</h1>
      <p className="text-sm text-gray-500 mb-6">
        Voer het nummer van het klustype in (of meerdere) — uren, bedrag en
        recyclagepremie worden automatisch ingevuld.
      </p>
      <NieuweKlusForm klustypes={klustypes ?? []} klanten={klanten ?? []} />
    </div>
  );
}
