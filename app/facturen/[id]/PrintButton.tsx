// app/facturen/[id]/PrintButton.tsx
"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-bumpr-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
    >
      🖨️ Afdrukken / Opslaan als PDF
    </button>
  );
}