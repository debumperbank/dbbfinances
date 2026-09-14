"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function maakFactuur(klusId: string) {
  const supabase = await createClient();

  const { data: klus } = await supabase
    .from("klussen")
    .select("*")
    .eq("id", klusId)
    .single();
  if (!klus) throw new Error("Klus niet gevonden");

  const { data: bedrijf } = await supabase
    .from("bedrijfsgegevens")
    .select("*")
    .eq("id", 1)
    .single();

  const btwPercentage = 21;
  const subtotaal = Number(klus.totaal_bedrag);
  const btwBedrag = subtotaal * (btwPercentage / 100);
  const totaal = subtotaal + btwBedrag;

  const volgnummer = bedrijf?.volgend_factuurnummer ?? 1;
  const factuurnummer = `${bedrijf?.factuur_prefix ?? "BUMPR"}-${new Date().getFullYear()}-${String(
    volgnummer
  ).padStart(4, "0")}`;

  // 1. Voeg .select().single() toe om het aangemaakte factuur-object terug te krijgen
  const { data: factuur, error } = await supabase
    .from("facturen")
    .insert({
      klus_id: klus.id,
      type: "factuur",
      factuurnummer,
      klant_id: klus.klant_id,
      subtotaal,
      btw_percentage: btwPercentage,
      btw_bedrag: btwBedrag,
      totaal,
      status: "open",
    })
    .select()
    .single();

  if (error || !factuur) {
    throw new Error("Fout bij het aanmaken van de factuur");
  }

  await supabase
    .from("klussen")
    .update({ status: "gefactureerd" })
    .eq("id", klus.id);

  await supabase
    .from("bedrijfsgegevens")
    .update({ volgend_factuurnummer: volgnummer + 1 })
    .eq("id", 1);

  revalidatePath("/facturen");
  revalidatePath("/klussen");

  // 2. Stuur de admin direct door naar de specifieke pagina van de nieuwe factuur
  redirect(`/facturen/${factuur.id}`);
}

export async function markeerVoldaan(factuurId: string, klusId: string | null) {
  const supabase = await createClient();
  await supabase.from("facturen").update({ status: "voldaan" }).eq("id", factuurId);
  if (klusId) {
    await supabase.from("klussen").update({ status: "voldaan" }).eq("id", klusId);
  }
  revalidatePath("/facturen");
}