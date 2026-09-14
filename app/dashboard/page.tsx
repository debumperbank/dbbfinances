import { createClient } from "@/lib/supabase/server";
import UrencriteriumTeller from "@/components/UrencriteriumTeller";

export default async function DashboardPage() {
  const supabase = await createClient();
  const boekjaar = new Date().getFullYear();

  const [{ data: klussen }, { data: uitgaven }, { data: bedrijf }] =
    await Promise.all([
      supabase.from("klussen").select("*").eq("boekjaar", boekjaar),
      supabase.from("uitgaven").select("*").eq("boekjaar", boekjaar),
      supabase.from("bedrijfsgegevens").select("*").eq("id", 1).single(),
    ]);

  const inkomsten = (klussen ?? []).reduce(
    (s, k) => s + Number(k.totaal_bedrag ?? 0),
    0
  );
  const kosten = (uitgaven ?? []).reduce((s, u) => s + Number(u.bedrag ?? 0), 0);
  const winst = inkomsten - kosten;
  const gewerkteUren = (klussen ?? []).reduce(
    (s, k) => s + Number(k.totaal_uren ?? 0),
    0
  );
  const aantalKlanten = new Set((klussen ?? []).map((k) => k.klant_id)).size;
  const gemiddeldPerKlus = klussen && klussen.length ? inkomsten / klussen.length : 0;

  // Simpele schatting inkomstenbelasting/zelfstandige reservering: 30% van de winst
  // (indicatief — pas dit later aan met de echte fiscale regels).
  const belastingreservering = Math.max(0, winst * 0.3);

  const urencriteriumDoel = bedrijf?.urencriterium_uren ?? 1225;

  // Uitgaven per categorie (grootste kostenposten)
  const perCategorie: Record<string, number> = {};
  (uitgaven ?? []).forEach((u) => {
    const cat = u.categorie || "Overig";
    perCategorie[cat] = (perCategorie[cat] || 0) + Number(u.bedrag ?? 0);
  });
  const topKosten = Object.entries(perCategorie).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Dashboard — Boekjaar {boekjaar}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Winst" value={`€${winst.toFixed(2)}`} highlight />
        <KpiCard label="Inkomsten" value={`€${inkomsten.toFixed(2)}`} />
        <KpiCard label="Uitgaven" value={`€${kosten.toFixed(2)}`} />
        <KpiCard
          label="Reservering belasting (indicatief 30%)"
          value={`€${belastingreservering.toFixed(2)}`}
        />
        <KpiCard label="Aantal klanten" value={String(aantalKlanten)} />
        <KpiCard label="Aantal klussen" value={String(klussen?.length ?? 0)} />
        <KpiCard
          label="Gem. bedrag per klus"
          value={`€${gemiddeldPerKlus.toFixed(2)}`}
        />
        <KpiCard label="Gewerkte uren" value={`${gewerkteUren.toFixed(1)} u`} />
      </div>

      <UrencriteriumTeller
        gewerkteUren={gewerkteUren}
        doelUren={urencriteriumDoel}
      />

      <div className="bg-white rounded-xl shadow-sm border p-5">
        <h2 className="font-semibold text-sm mb-3">Grootste kostenposten</h2>
        {topKosten.length === 0 && (
          <p className="text-sm text-gray-400">Nog geen uitgaven gelogd.</p>
        )}
        <div className="space-y-2">
          {topKosten.map(([cat, bedrag]) => (
            <div key={cat} className="flex items-center justify-between text-sm">
              <span>{cat}</span>
              <span className="font-medium">€{bedrag.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 border ${
        highlight ? "bg-bumpr text-white" : "bg-white"
      }`}
    >
      <p
        className={`text-xs mb-1 ${
          highlight ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
