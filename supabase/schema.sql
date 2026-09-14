-- BUMPR / De Bumperbank — Financiën & Facturatie app
-- Supabase schema. Voer dit uit in de Supabase SQL editor.
-- Alles is bedoeld voor 1 gebruiker (jij), dus RLS is simpel: alleen ingelogde
-- gebruikers mogen lezen/schrijven.

-- ============ BEDRIJFSGEGEVENS (eenmalig invullen) ============
create table if not exists bedrijfsgegevens (
  id int primary key default 1,
  bedrijfsnaam text not null default 'BUMPR / De Bumperbank',
  kvk_nummer text,
  btw_nummer text,
  iban text,
  adres text,
  telefoon text,
  email text,
  factuur_prefix text not null default 'BUMPR',
  volgend_factuurnummer int not null default 1,
  urencriterium_uren int not null default 1225,
  constraint single_row check (id = 1)
);
insert into bedrijfsgegevens (id) values (1) on conflict (id) do nothing;

-- ============ KLUSTYPES (het "nummeriek menu") ============
-- Elk nummer = een type klus met vast aantal uren, tarief, en of er
-- recyclagepremie bij hoort.
create table if not exists klustypes (
  id uuid primary key default gen_random_uuid(),
  nummer int not null unique,
  naam text not null,
  standaard_uren numeric(6,2) not null default 0,
  uurtarief numeric(8,2) not null default 0,
  vast_bedrag numeric(8,2), -- optioneel: vaste prijs i.p.v. uren x tarief
  recyclagepremie boolean not null default false,
  recyclagepremie_bedrag numeric(8,2) not null default 0,
  actief boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============ KLANTEN ============
create table if not exists klanten (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  adres text,
  email text,
  telefoon text,
  created_at timestamptz not null default now()
);

-- ============ KLUSSEN ============
create table if not exists klussen (
  id uuid primary key default gen_random_uuid(),
  klant_id uuid references klanten(id),
  datum date not null default current_date,
  boekjaar int not null default extract(year from current_date),
  status text not null default 'open', -- open | gefactureerd | voldaan
  notities text,
  totaal_uren numeric(6,2) not null default 0,
  totaal_bedrag numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

-- Koppeltabel: welke klustype-nummers zitten in deze klus (kan er meerdere zijn)
create table if not exists klus_items (
  id uuid primary key default gen_random_uuid(),
  klus_id uuid not null references klussen(id) on delete cascade,
  klustype_id uuid not null references klustypes(id),
  aantal int not null default 1,
  uren numeric(6,2) not null,      -- gekopieerd/berekend op moment van toevoegen
  bedrag numeric(10,2) not null,   -- idem
  recyclagepremie_bedrag numeric(8,2) not null default 0
);

-- ============ ONDERDELEN (voor later: groothandelaar-koppeling) ============
create table if not exists onderdelen (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  leverancier text,
  inkoopprijs numeric(10,2),
  marge_percentage numeric(5,2) default 15,
  verkoopprijs numeric(10,2),
  voorraad int,
  laatst_bijgewerkt timestamptz default now()
);

-- Onderdelen die op een klus/factuur gebruikt zijn
create table if not exists klus_onderdelen (
  id uuid primary key default gen_random_uuid(),
  klus_id uuid not null references klussen(id) on delete cascade,
  onderdeel_id uuid references onderdelen(id),
  omschrijving text not null,
  aantal int not null default 1,
  prijs_per_stuk numeric(10,2) not null
);

-- ============ OFFERTES / FACTUREN ============
create table if not exists facturen (
  id uuid primary key default gen_random_uuid(),
  klus_id uuid references klussen(id),
  type text not null default 'factuur', -- offerte | factuur
  factuurnummer text unique,
  klant_id uuid references klanten(id),
  datum date not null default current_date,
  vervaldatum date,
  subtotaal numeric(10,2) not null default 0,
  btw_percentage numeric(5,2) not null default 21,
  btw_bedrag numeric(10,2) not null default 0,
  totaal numeric(10,2) not null default 0,
  status text not null default 'open', -- open | voldaan | vervallen
  pdf_url text,
  created_at timestamptz not null default now()
);

-- ============ UITGAVEN ============
create table if not exists uitgaven (
  id uuid primary key default gen_random_uuid(),
  omschrijving text not null,
  categorie text, -- brandstof, onderdelen, gereedschap, verzekering, bus, overig...
  bedrag numeric(10,2) not null,
  datum date not null default current_date,
  boekjaar int not null default extract(year from current_date),
  created_at timestamptz not null default now()
);

-- ============ RLS: alleen ingelogde gebruiker mag lezen/schrijven ============
alter table bedrijfsgegevens enable row level security;
alter table klustypes enable row level security;
alter table klanten enable row level security;
alter table klussen enable row level security;
alter table klus_items enable row level security;
alter table onderdelen enable row level security;
alter table klus_onderdelen enable row level security;
alter table facturen enable row level security;
alter table uitgaven enable row level security;

create policy "auth full access" on bedrijfsgegevens for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on klustypes for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on klanten for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on klussen for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on klus_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on onderdelen for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on klus_onderdelen for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on facturen for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth full access" on uitgaven for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ============ VOORBEELD KLUSTYPES (pas aan naar jouw diensten) ============
insert into klustypes (nummer, naam, standaard_uren, uurtarief, recyclagepremie, recyclagepremie_bedrag) values
  (1, 'Full Detail', 3, 45, false, 0),
  (2, 'Hydro Coat', 2, 45, false, 0),
  (3, 'Bandenwissel', 0.5, 40, true, 7.50),
  (4, 'Uitlaat vervangen', 1.5, 55, true, 12.00),
  (5, 'Kleine mechanische reparatie', 1, 50, false, 0)
on conflict (nummer) do nothing;
