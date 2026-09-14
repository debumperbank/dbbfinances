"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/klussen", label: "Klussen" },
  { href: "/facturen", label: "Facturen" },
  { href: "/instellingen/klustypes", label: "Klustypes" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  if (pathname.startsWith("/login")) return null;

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="bg-bumpr text-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold tracking-tight">
          BUMPR <span className="text-bumpr-accent">Financiën</span>
        </span>
        <div className="flex gap-4 text-sm items-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname.startsWith(l.href)
                  ? "text-bumpr-accent font-medium"
                  : "text-gray-300 hover:text-white"
              }
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-xs border border-gray-600 rounded px-2 py-1"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </nav>
  );
}
