
// REQ-SAF-001: UI must default to safe state on error
import React, { useState } from "react";
import { GlassCard, GlassHeader, GlassSection } from "./theme/GlassmorphismTheme";
import GlassmorphicToneGenerator from "./GlassmorphicToneGenerator";

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
		<div style={{ minHeight: '100vh', width: '100vw', background: 'linear-gradient(135deg, #232b2b 60%, #e0e4e4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', position: 'fixed', top: 0, left: 0, zIndex: 0 }}>
			<div className="w-full max-w-2xl mx-auto space-y-10" style={{zIndex: 1}}>
				   {/* Header is now handled in GlassmorphicToneGenerator for full control and size */}
				<div className="flex justify-center">
					<GlassmorphicToneGenerator />
				</div>
			</div>
		</div>
	);
}
