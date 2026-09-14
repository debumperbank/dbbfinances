"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface FactuurParams {
  klus_id: string;
  klant_id?: string;
  subtotaal: number;
  btw_bedrag: number;
  totaal: number;
  type?: string;
  datum?: string;
}

export async function maakFactuur(params: FactuurParams) {
  const supabase = await createClient();

  // 1. Maak de factuur aan met de exacte kolomnamen uit je schema
  const { data: factuur, error: factuurError } = await supabase
    .from("facturen")
    .insert({
      klus_id: params.klus_id,
      klant_id: params.klant_id || null,
      type: params.type || "verkoop",
      datum: params.datum || new Date().toISOString().split("T")[0],
      subtotaal: params.subtotaal,
      btw_percentage: 21,
      btw_bedrag: params.btw_bedrag,
      totaal: params.totaal,
      status: "concept",
    })
    .select()
    .single();

  if (factuurError) {
    throw new Error(`Fout bij aanmaken factuur: ${factuurError.message}`);
  }

  // 2. Pas de status van de klus aan naar 'gefactureerd'
  const { error: klusError } = await supabase
    .from("klussen")
    .update({ status: "gefactureerd" })
    .eq("id", params.klus_id);

  if (klusError) {
    console.error("Fout bij bijwerken klus status:", klusError.message);
  }

  // 3. Ververs de pagina-caches in Next.js
  revalidatePath("/facturen");
  revalidatePath("/klussen");

  return { success: true, factuur };
}