# BUMPR Financiën

Financieel beheer voor De Bumperbank / BUMPR: klussen loggen via een
nummeriek menu, automatische offertes/facturen, en een dashboard met winst,
belasting-reservering, KPI's en het urencriterium (1.225 uur).

## Wat zit erin (v1)

- **Login** (Supabase auth, e-mail/wachtwoord) — alleen jij hebt toegang
- **Klustypes instellen**: nummer, naam, standaard uren, uurtarief, recyclagepremie
- **Klus loggen**: typ een nummer → uren/bedrag/recyclagepremie worden
  automatisch ingevuld; meerdere nummers per klus mogelijk
- **Facturen**: met één klik een factuur maken van een klus, incl. automatisch
  oplopend factuurnummer en BTW-berekening
- **Dashboard**: winst, inkomsten/uitgaven, indicatieve belastingreservering,
  aantal klanten, gemiddeld bedrag per klus, grootste kostenposten
- **Urencriterium-teller**: rood + aftellend zolang je onder de 1.225 uur zit,
  groen + optellend zodra je erover bent

## Nog niet gebouwd (voor later, zoals besproken)

- Koppeling met groothandelaren voor real-time onderdelen-voorraad en
  bestellen via je eigen portaal (tabel `onderdelen` staat al klaar)
- PDF-export van facturen (nu alleen digitaal overzicht in de app)
- Uitgaven-invoerscherm (tabel `uitgaven` bestaat al in de database, formulier
  moet nog toegevoegd worden)

## Setup

### 1. Supabase project aanmaken

1. Ga naar [supabase.com](https://supabase.com) en maak een nieuw project aan
2. Ga naar **SQL Editor** en plak de inhoud van `supabase/schema.sql`, run het
3. Ga naar **Authentication → Users** en maak jezelf handmatig aan als
   gebruiker (e-mail + wachtwoord) — dit is de enige login die de app nodig heeft
4. Ga naar **Project Settings → API** en kopieer:
   - `Project URL`
   - `anon public` key

### 2. Lokaal draaien

```bash
npm install
cp .env.local.example .env.local
# vul NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — je wordt naar `/login`
gestuurd.

### 3. Deployen op Vercel

1. Zet deze map in een git-repo (bv. GitHub)
2. Ga naar [vercel.com](https://vercel.com) → **New Project** → importeer de repo
3. Bij **Environment Variables**, voeg toe:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — daarna kun je vanaf elk apparaat inloggen op je eigen domein/URL

### 4. Eigen klustypes instellen

Na inloggen ga je naar **Klustypes** en vervang je de voorbeelddata (Full
Detail, Hydro Coat, etc.) door jouw eigen diensten en prijzen.

## Structuur

```
app/
  login/            login-pagina
  dashboard/         KPI's, winst, urencriterium
  klussen/            klussen loggen (nummeriek menu) en overzicht
  facturen/           facturen genereren en overzicht
  instellingen/klustypes/   klustypes beheren
lib/supabase/        Supabase client/server/middleware helpers
components/           herbruikbare UI-onderdelen
supabase/schema.sql   volledige databasestructuur
```
# dbbfinances
