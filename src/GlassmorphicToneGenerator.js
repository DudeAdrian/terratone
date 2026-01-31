import React, { useRef, useState } from "react";

// Unified protocol array: clinical and traditional
const PROTOCOLS = [
  // Clinical
  {
    id: 'gamma-40hz',
    label: '40Hz Gamma',
    frequency: 40,
    mode: 'single',
    tier: 'Tier 1',
    evidence: 'Peer-reviewed (Multiple RCTs)',
    modality: 'Speakers or headphones',
    duration: '60 min daily',
    notes: 'Neurodegenerative prevention, mild cognitive impairment, sleep quality.',
    contraindications: 'Tinnitus, seizure disorders.',
    type: 'clinical',
  },
  {
    id: 'delta-binaural',
    label: 'Delta (2–4Hz) Binaural',
    left: 200,
    right: 202,
    mode: 'binaural',
    tier: 'Tier 2',
    evidence: 'Peer-reviewed (Promising RCTs)',
    modality: 'Headphones',
    duration: '20–45 min',
    notes: 'Sleep initiation, anxiety reduction.',
    contraindications: 'Tinnitus, seizure disorders.',
    type: 'clinical',
  },
  {
    id: 'theta-binaural',
    label: 'Theta (6Hz) Binaural',
    left: 200,
    right: 206,
    mode: 'binaural',
    tier: 'Tier 2',
    evidence: 'Peer-reviewed (Promising RCTs)',
    modality: 'Headphones',
    duration: '15–30 min',
    notes: 'Deep relaxation, meditation depth.',
    contraindications: 'Tinnitus, seizure disorders.',
    type: 'clinical',
  },
  // Traditional
  {
    id: 'solfeggio-528',
    label: '528Hz Solfeggio',
    frequency: 528,
    mode: 'single',
    tier: 'Intuitive/Traditional',
    evidence: 'No peer-reviewed clinical trials',
    modality: 'Speakers or headphones',
    duration: 'Flexible',
    notes: 'DNA repair, transformation (theoretical/traditional use).',
    contraindications: 'None known.',
    type: 'traditional',
  },
  {
    id: 'binaural-10hz',
    label: 'Alpha (10Hz) Binaural',
    left: 200,
    right: 210,
    mode: 'binaural',
    tier: 'Intuitive/Traditional',
    evidence: 'Mixed/controversial',
    modality: 'Headphones',
    duration: 'Flexible',
    notes: 'Immediate stress reduction (anecdotal).',
    contraindications: 'Tinnitus, seizure disorders.',
    type: 'traditional',
  },
];

const BRAND_CONFIG = {
  displayName: 'TerraTone',
  color: 'rgba(76, 175, 80, 0.7)',
  accent: '#4CAF50',
  description: 'Universal Frequency Generator',
};

const GlassmorphicToneGenerator = ({ onMetaRecord }) => {
  const [frequency, setFrequency] = useState(PROTOCOLS[0].frequency || 40);
  const [binaural, setBinaural] = useState({ left: PROTOCOLS[1].left || 200, right: PROTOCOLS[1].right || 202 });
  const [duration, setDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState(PROTOCOLS[0].mode);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState(PROTOCOLS[0]);
  return (
    <>
      <div style={{
        background: `rgba(30, 40, 40, 0.35)`,
        boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 0 0 6px ${BRAND_CONFIG.accent}33`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 32,
        maxWidth: 520,
        margin: '48px auto',
        padding: 32,
        color: '#e0e0e0',
        fontFamily: 'Montserrat, Segoe UI, Roboto, Arial, sans-serif',
      }}>
        <div style={{ fontFamily: 'Zen Tokyo Zoo, Montserrat, Segoe UI, Roboto, Arial, sans-serif', fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 18, color: BRAND_CONFIG.accent, letterSpacing: 2, textShadow: '0 2px 12px #2228' }}>
          {BRAND_CONFIG.displayName}
        </div>
        <div style={{ fontSize: 18, textAlign: 'center', marginBottom: 24, color: '#bff', fontWeight: 600 }}>{BRAND_CONFIG.description}</div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>Protocol</label>
          <select value={selectedProtocol.id} onChange={e => {
            const proto = PROTOCOLS.find(p => p.id === e.target.value);
            setSelectedProtocol(proto);
            setMode(proto.mode);
            if (proto.mode === 'single') setFrequency(proto.frequency);
            else setBinaural({ left: proto.left, right: proto.right });
          }} style={{ fontSize: 16, padding: '6px 18px', borderRadius: 8, border: '1px solid #ccc', background: '#222', color: BRAND_CONFIG.accent }}>
            {PROTOCOLS.map(p => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {mode === 'single' ? (
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>Frequency</label>
              <input type="range" min={20} max={20000} value={frequency} onChange={e => setFrequency(Number(e.target.value))} disabled={isPlaying} style={{ width: 220, accentColor: BRAND_CONFIG.accent }} />
              <span style={{ marginLeft: 12, fontWeight: 600, fontSize: 16 }}>{frequency} Hz</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 8 }}>
              <div>
                <label style={{ fontWeight: 700, fontSize: 16, marginRight: 8 }}>Left</label>
                <input type="range" min={20} max={20000} value={binaural.left} onChange={e => setBinaural({ ...binaural, left: Number(e.target.value) })} disabled={isPlaying} style={{ width: 120, accentColor: BRAND_CONFIG.accent }} />
                <span style={{ marginLeft: 8, fontWeight: 600, fontSize: 16 }}>{binaural.left} Hz</span>
              </div>
              <div>
                <label style={{ fontWeight: 700, fontSize: 16, marginRight: 8 }}>Right</label>
                <input type="range" min={20} max={20000} value={binaural.right} onChange={e => setBinaural({ ...binaural, right: Number(e.target.value) })} disabled={isPlaying} style={{ width: 120, accentColor: BRAND_CONFIG.accent }} />
                <span style={{ marginLeft: 8, fontWeight: 600, fontSize: 16 }}>{binaural.right} Hz</span>
              </div>
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>Duration</label>
            <input type="range" min={1} max={3600} value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isPlaying} style={{ width: 180, accentColor: BRAND_CONFIG.accent }} />
            <span style={{ marginLeft: 12, fontWeight: 600, fontSize: 16 }}>{duration} s</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Duration (seconds): </label>
          <input type="number" min={1} max={3600} value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isPlaying} style={{ width: 80, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', padding: 4, marginLeft: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18, justifyContent: 'center' }}>
          <button onClick={() => setIsPlaying(true)} disabled={isPlaying} style={{
            background: isPlaying ? '#222' : BRAND_CONFIG.accent,
            color: '#fff',
            padding: '16px 38px',
            border: 'none',
            borderRadius: 16,
            fontWeight: 900,
            fontSize: 22,
            boxShadow: isPlaying ? `0 0 16px 4px #fff8` : `0 2px 16px 0 ${BRAND_CONFIG.accent}55`,
            letterSpacing: 1,
            outline: isPlaying ? `2px solid #fff` : 'none',
            transition: 'all 0.2s',
            cursor: isPlaying ? 'not-allowed' : 'pointer',
            textShadow: '0 2px 8px #2228',
          }}>
            {isPlaying ? 'Playing...' : 'Play Tone'}
          </button>
          {isPlaying && (
            <button onClick={() => setIsPlaying(false)} style={{
              background: '#888',
              color: '#fff',
              padding: '16px 38px',
              border: 'none',
              borderRadius: 16,
              fontWeight: 900,
              fontSize: 22,
              boxShadow: '0 2px 16px 0 #8888',
              letterSpacing: 1,
              outline: 'none',
              textShadow: '0 2px 8px #2228',
            }}>Stop</button>
          )}
        </div>
        <div style={{ fontSize: 14, color: '#e0e0e0', marginTop: 12 }}>
          <b>Quantified:</b> {mode === 'single' ? `Frequency: ${frequency}Hz` : `Left: ${binaural.left}Hz, Right: ${binaural.right}Hz`} | Duration: {duration}s | Mode: {mode}
        </div>
      </div>
      {/* Evidence and Disclaimer below panel for minimalism */}
      <div style={{ maxWidth: 520, margin: '18px auto 0 auto', fontFamily: 'Montserrat, Segoe UI, Roboto, Arial, sans-serif' }}>
        {selectedProtocol && (
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 16, color: '#e0e0e0' }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Protocol Info</div>
            <div><b>Tier:</b> {selectedProtocol.tier}</div>
            <div><b>Evidence:</b> {selectedProtocol.evidence}</div>
            <div><b>Modality:</b> {selectedProtocol.modality}</div>
            <div><b>Recommended Duration:</b> {selectedProtocol.duration}</div>
            <div><b>Notes:</b> {selectedProtocol.notes}</div>
            <div><b>Contraindications:</b> {selectedProtocol.contraindications}</div>
            <div><b>Type:</b> {selectedProtocol.type === 'clinical' ? 'Peer-reviewed/Clinical' : 'Traditional/Intuitive'}</div>
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          <button style={{ background: '#222', color: BRAND_CONFIG.accent, border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontFamily: 'Montserrat' }} onClick={() => window.open('/evidence-library', '_blank')}>View Evidence Library</button>
        </div>
        <div className="terratone-companion" style={{ fontSize: 13, color: '#ffb', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 10, marginBottom: 12 }}>
          <b>Disclaimer:</b> Protocols are labeled by evidence tier. Peer-reviewed pathways are based on published clinical evidence; traditional pathways are included for holistic and intuitive value. This does not constitute medical treatment. Consult healthcare providers for cognitive or neurological symptoms. Contraindications: Photosensitive epilepsy (for visual components), tinnitus (caution with high frequencies), seizure disorders.
        </div>
      </div>
    </>
  );
}

export default GlassmorphicToneGenerator;
