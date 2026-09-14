import { createClient } from "@/lib/supabase/server";
import KlustypeForm from "@/components/KlustypeForm";

export default async function KlustypesPage() {
  const supabase = await createClient();
  const { data: klustypes } = await supabase
    .from("klustypes")
    .select("*")
    .order("nummer");

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Klustypes</h1>
      <p className="text-sm text-gray-500 mb-6">
        Elk nummer staat voor een type klus, met vaste uren, tarief en of er
        recyclagepremie bij hoort. Dit nummer gebruik je straks bij het loggen
        van een klus.
      </p>

      <KlustypeForm existing={klustypes ?? []} />
    </div>
  );
}
