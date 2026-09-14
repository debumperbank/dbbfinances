(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/NieuweKlusForm.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NieuweKlusForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function NieuweKlusForm({ klustypes, klanten }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const [nummerInput, setNummerInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [regels, setRegels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [klantId, setKlantId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [nieuweKlantNaam, setNieuweKlantNaam] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [saving, setSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    function voegNummerToe(e) {
        e.preventDefault();
        const nummer = Number(nummerInput);
        const type = klustypes.find((k)=>k.nummer === nummer);
        if (!type) {
            setError(`Geen klustype gevonden met nummer ${nummer}`);
            return;
        }
        setError(null);
        setRegels((prev)=>{
            const bestaand = prev.find((r)=>r.klustype.id === type.id);
            if (bestaand) {
                return prev.map((r)=>r.klustype.id === type.id ? {
                        ...r,
                        aantal: r.aantal + 1
                    } : r);
            }
            const bedrag = type.vast_bedrag ?? type.standaard_uren * type.uurtarief;
            return [
                ...prev,
                {
                    klustype: type,
                    aantal: 1,
                    uren: type.standaard_uren,
                    bedrag,
                    recyclagepremie_bedrag: type.recyclagepremie ? type.recyclagepremie_bedrag : 0
                }
            ];
        });
        setNummerInput("");
    }
    function verwijderRegel(id) {
        setRegels((prev)=>prev.filter((r)=>r.klustype.id !== id));
    }
    const totaalUren = regels.reduce((s, r)=>s + r.uren * r.aantal, 0);
    const totaalBedrag = regels.reduce((s, r)=>s + r.bedrag * r.aantal + r.recyclagepremie_bedrag * r.aantal, 0);
    async function opslaan() {
        if (regels.length === 0) {
            setError("Voeg minstens één klustype toe.");
            return;
        }
        setSaving(true);
        setError(null);
        let finalKlantId = klantId;
        if (!finalKlantId && nieuweKlantNaam.trim()) {
            const { data: nieuweKlant, error: klantError } = await supabase.from("klanten").insert({
                naam: nieuweKlantNaam.trim()
            }).select().single();
            if (klantError) {
                setError("Kon klant niet aanmaken.");
                setSaving(false);
                return;
            }
            finalKlantId = nieuweKlant.id;
        }
        const { data: klus, error: klusError } = await supabase.from("klussen").insert({
            klant_id: finalKlantId || null,
            totaal_uren: totaalUren,
            totaal_bedrag: totaalBedrag,
            boekjaar: new Date().getFullYear()
        }).select().single();
        if (klusError || !klus) {
            setError("Kon klus niet opslaan.");
            setSaving(false);
            return;
        }
        const items = regels.map((r)=>({
                klus_id: klus.id,
                klustype_id: r.klustype.id,
                aantal: r.aantal,
                uren: r.uren,
                bedrag: r.bedrag,
                recyclagepremie_bedrag: r.recyclagepremie_bedrag
            }));
        await supabase.from("klus_items").insert(items);
        setSaving(false);
        router.push("/klussen");
        router.refresh();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "block text-xs text-gray-500 mb-1",
                        children: "Klant"
                    }, void 0, false, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: klantId,
                        onChange: (e)=>setKlantId(e.target.value),
                        className: "w-full border rounded-md px-3 py-2 text-sm mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "",
                                children: "— Nieuwe klant —"
                            }, void 0, false, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            klanten.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                    value: k.id,
                                    children: k.naam
                                }, k.id, false, {
                                    fileName: "[project]/components/NieuweKlusForm.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    !klantId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Naam nieuwe klant",
                        value: nieuweKlantNaam,
                        onChange: (e)=>setNieuweKlantNaam(e.target.value),
                        className: "w-full border rounded-md px-3 py-2 text-sm"
                    }, void 0, false, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 161,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/NieuweKlusForm.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-gray-500 mb-3",
                        children: "Beschikbare klustypes"
                    }, void 0, false, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-4",
                        children: klustypes.map((k)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setNummerInput(String(k.nummer)),
                                className: "text-xs border rounded-full px-3 py-1 hover:border-bumpr-accent hover:text-bumpr-accent",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono font-bold",
                                        children: k.nummer
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this),
                                    " — ",
                                    k.naam
                                ]
                            }, k.id, true, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 176,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 174,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: voegNummerToe,
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "number",
                                inputMode: "numeric",
                                autoFocus: true,
                                placeholder: "Nummer",
                                value: nummerInput,
                                onChange: (e)=>setNummerInput(e.target.value),
                                className: "border rounded-md px-3 py-2 text-sm w-32 text-center text-lg font-mono"
                            }, void 0, false, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "bg-bumpr-accent text-white text-sm rounded-md px-4 py-2 font-medium",
                                children: "Toevoegen"
                            }, void 0, false, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 197,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 187,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-600 text-sm mt-2",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/NieuweKlusForm.tsx",
                        lineNumber: 204,
                        columnNumber: 19
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/NieuweKlusForm.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            regels.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "bg-gray-50 text-left text-gray-500",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2",
                                        children: "#"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 213,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2",
                                        children: "Klustype"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 214,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2",
                                        children: "Aantal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 215,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2",
                                        children: "Uren"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 216,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2",
                                        children: "Bedrag"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 217,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-4 py-2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 218,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 212,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/NieuweKlusForm.tsx",
                            lineNumber: 211,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: regels.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-t",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 font-mono",
                                            children: r.klustype.nummer
                                        }, void 0, false, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 224,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2",
                                            children: r.klustype.naam
                                        }, void 0, false, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 225,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2",
                                            children: [
                                                r.aantal,
                                                "×"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 226,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2",
                                            children: [
                                                (r.uren * r.aantal).toFixed(2),
                                                " u"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 227,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2",
                                            children: [
                                                "€",
                                                (r.bedrag * r.aantal + r.recyclagepremie_bedrag * r.aantal).toFixed(2),
                                                r.recyclagepremie_bedrag > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-xs text-gray-400",
                                                    children: [
                                                        " ",
                                                        "(incl. €",
                                                        r.recyclagepremie_bedrag,
                                                        " recyclagepremie)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/NieuweKlusForm.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 228,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-4 py-2 text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>verwijderRegel(r.klustype.id),
                                                className: "text-xs text-gray-400 hover:text-red-600",
                                                children: "verwijderen"
                                            }, void 0, false, {
                                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                                lineNumber: 238,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/NieuweKlusForm.tsx",
                                            lineNumber: 237,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, r.klustype.id, true, {
                                    fileName: "[project]/components/NieuweKlusForm.tsx",
                                    lineNumber: 223,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/NieuweKlusForm.tsx",
                            lineNumber: 221,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-t bg-gray-50 font-semibold",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: 3,
                                        className: "px-4 py-2 text-right",
                                        children: "Totaal"
                                    }, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 250,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-4 py-2",
                                        children: [
                                            totaalUren.toFixed(2),
                                            " u"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 253,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        className: "px-4 py-2",
                                        children: [
                                            "€",
                                            totaalBedrag.toFixed(2)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 254,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {}, void 0, false, {
                                        fileName: "[project]/components/NieuweKlusForm.tsx",
                                        lineNumber: 255,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/NieuweKlusForm.tsx",
                                lineNumber: 249,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/NieuweKlusForm.tsx",
                            lineNumber: 248,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/NieuweKlusForm.tsx",
                    lineNumber: 210,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/NieuweKlusForm.tsx",
                lineNumber: 209,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: opslaan,
                disabled: saving,
                className: "bg-bumpr text-white rounded-md px-5 py-2.5 text-sm font-medium disabled:opacity-50",
                children: saving ? "Opslaan..." : "Klus opslaan"
            }, void 0, false, {
                fileName: "[project]/components/NieuweKlusForm.tsx",
                lineNumber: 262,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/NieuweKlusForm.tsx",
        lineNumber: 144,
        columnNumber: 5
    }, this);
}
_s(NieuweKlusForm, "kXHDPU7j67gSCxNn1UKdtTI9E0I=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NieuweKlusForm;
var _c;
__turbopack_context__.k.register(_c, "NieuweKlusForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_NieuweKlusForm_tsx_0rnma-k._.js.map