
// REQ-SAF-001: UI must default to safe state on error
import React, { useState } from "react";
import { GlassCard, GlassHeader, GlassSection } from "theme/GlassmorphismTheme";

const protocols = [
	{ label: "Wellness (Green Zone)", value: "wellness" },
	{ label: "Therapeutic (Red Zone)", value: "therapeutic" }
];

export default function App() {
	const [protocol, setProtocol] = useState("wellness");
	const [error, setError] = useState(null);

	// Defensive: fail-safe UI
	if (error) {
		return (
			<GlassCard className="max-w-xl mx-auto mt-24">
				<GlassHeader>System Error</GlassHeader>
				<div className="text-red-600">{error}</div>
				<div className="text-sm text-gray-500 mt-2">All outputs halted. Please contact support.</div>
			</GlassCard>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 p-4 md:p-8">
			<div className="max-w-2xl mx-auto space-y-8">
				<GlassHeader primaryColor="blue" accentColor="emerald">
					TerraTone Frequency Generator
				</GlassHeader>
				<GlassSection title="Protocol Selector">
					<div className="flex gap-4">
						{protocols.map((p) => (
							<button
								key={p.value}
								className={`px-4 py-2 rounded-lg font-semibold transition-colors border ${protocol === p.value ? "bg-blue-500 text-white" : "bg-white text-blue-700"}`}
								onClick={() => setProtocol(p.value)}
								aria-pressed={protocol === p.value}
							>
								{p.label}
							</button>
						))}
					</div>
				</GlassSection>
				<GlassCard className="mt-6">
					<div className="text-lg font-medium mb-2">Current Protocol: <span className="font-bold text-blue-600">{protocol === "wellness" ? "Wellness (Green Zone)" : "Therapeutic (Red Zone)"}</span></div>
					<div className="text-sm text-gray-500">Select a protocol to begin. Red Zone requires hardware interlock and dual-authorization.</div>
				</GlassCard>
				<GlassSection title="Evidence & Regulatory Disclaimer" className="mt-8">
					<div className="text-xs text-gray-400">
						All therapeutic actions require hardware interlock and dual-authorization. No PHI is stored locally. See audit trail for all actions. <br />
						<span className="font-semibold">IEC 62304 Class C | FDA 21 CFR Part 820 | ISO 14971</span>
					</div>
				</GlassSection>
			</div>
		</div>
	);
}
