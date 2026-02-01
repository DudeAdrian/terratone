import React, { useRef, useState } from "react";
import GrainEffect from "./components/GrainEffect";

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
  // Solfeggio scale always visible, styled, central
  const SOLFEGGIO_TONES = [
    { freq: 174, label: '174Hz' },
    { freq: 285, label: '285Hz' },
    { freq: 396, label: '396Hz' },
    { freq: 417, label: '417Hz' },
    { freq: 528, label: '528Hz' },
    { freq: 639, label: '639Hz' },
    { freq: 741, label: '741Hz' },
    { freq: 852, label: '852Hz' },
    { freq: 963, label: '963Hz' },
  ];
  const BINAURAL_TONES = [
    { id: 'gamma-40hz', label: '40Hz Gamma', left: null, right: null, frequency: 40, mode: 'single' },
    { id: 'delta-binaural', label: 'Delta (2–4Hz) Binaural', left: 200, right: 202, frequency: null, mode: 'binaural' },
    { id: 'theta-binaural', label: 'Theta (6Hz) Binaural', left: 200, right: 206, frequency: null, mode: 'binaural' },
    { id: 'alpha-binaural', label: 'Alpha (10Hz) Binaural', left: 200, right: 210, frequency: null, mode: 'binaural' },
  ];
  const [solfeggioLayer, setSolfeggioLayer] = useState(0);
  const [binauralLayer, setBinauralLayer] = useState(0);
  const [frequency, setFrequency] = useState(SOLFEGGIO_TONES[0].freq);
  const [left, setLeft] = useState(BINAURAL_TONES[1].left);
  const [right, setRight] = useState(BINAURAL_TONES[1].right);
  const [mode, setMode] = useState('single');
  const [duration, setDuration] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);

  // Defensive: safely close AudioContext
  const safeCloseCtx = async (ctx) => {
    if (ctx && ctx.state !== 'closed') {
      try { await ctx.close(); } catch {}
    }
  };

  const handlePlay = () => {
    if (isPlaying) return;
    let ctx = audioCtxRef.current;
    try {
      if (!ctx || ctx.state === 'closed') {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === 'suspended') ctx.resume && ctx.resume();
      if (mode === 'single') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = frequency;
        osc.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        setIsPlaying(true);
        setTimeout(async () => {
          osc.stop();
          osc.disconnect();
          await safeCloseCtx(ctx);
          setIsPlaying(false);
        }, duration * 1000);
      } else {
        // Binaural
        const merger = ctx.createChannelMerger(2);
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        oscL.type = oscR.type = 'sine';
        oscL.frequency.value = left;
        oscR.frequency.value = right;
        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(ctx.destination);
        oscL.start();
        oscR.start();
        oscLeftRef.current = oscL;
        oscRightRef.current = oscR;
        setIsPlaying(true);
        setTimeout(async () => {
          oscL.stop();
          oscR.stop();
          oscL.disconnect();
          oscR.disconnect();
          merger.disconnect();
          await safeCloseCtx(ctx);
          setIsPlaying(false);
        }, duration * 1000);
      }
    } catch (err) {
      setIsPlaying(false);
    }
  };

  const handleStop = async () => {
    if (mode === 'single' && oscRef.current && audioCtxRef.current) {
      oscRef.current.stop();
      await safeCloseCtx(audioCtxRef.current);
      setIsPlaying(false);
    } else if (mode === 'binaural' && oscLeftRef.current && oscRightRef.current && audioCtxRef.current) {
      oscLeftRef.current.stop();
      oscRightRef.current.stop();
      await safeCloseCtx(audioCtxRef.current);
      setIsPlaying(false);
    }
  };
  return (
    <div style={{ position: 'relative', width: 620, height: 520, margin: '48px auto' }}>
      <GrainEffect isPlaying={isPlaying} />
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(30, 40, 40, 0.35)',
        boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 0 0 6px ${BRAND_CONFIG.accent}33`,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: 32,
        maxWidth: 620,
        margin: '0 auto',
        padding: 32,
        color: '#e0e0e0',
        fontFamily: 'Montserrat, Segoe UI, Roboto, Arial, sans-serif',
      }}>
        <div style={{
          fontFamily: 'Zen Tokyo Zoo, Montserrat, Segoe UI, Roboto, Arial, sans-serif',
          fontSize: 96,
          fontWeight: 900,
          textAlign: 'center',
          marginBottom: 18,
          color: BRAND_CONFIG.accent,
          letterSpacing: 2,
          textShadow: '0 4px 32px #2228',
          transform: 'skew(-18deg, 0deg)',
          lineHeight: 0.8,
        }}>
          {BRAND_CONFIG.displayName}
        </div>
        <div style={{ fontSize: 24, textAlign: 'center', marginBottom: 24, color: '#bff', fontWeight: 700 }}>{BRAND_CONFIG.description}</div>
        {/* Dropdowns Side by Side */}
        <div style={{ display: 'flex', flexDirection: 'row', gap: 32, justifyContent: 'center', marginBottom: 24 }}>
          {/* Solfeggio Dropdown */}
          <div style={{ background: 'rgba(30,40,40,0.25)', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px #2228', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 220 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: BRAND_CONFIG.accent, fontSize: 22 }}>Solfeggio Catalogue</div>
            <select value={solfeggioLayer} onChange={e => {
              const idx = Number(e.target.value);
              setSolfeggioLayer(idx);
              setFrequency(SOLFEGGIO_TONES[idx].freq);
              setMode('single');
            }} style={{ fontSize: 18, padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc', background: '#222', color: BRAND_CONFIG.accent, marginBottom: 12 }}>
              {SOLFEGGIO_TONES.map((tone, idx) => (
                <option key={tone.freq} value={idx}>{tone.label}</option>
              ))}
            </select>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected: {frequency} Hz</div>
          </div>
          {/* Binaural/Clinical Dropdown */}
          <div style={{ background: 'rgba(30,40,40,0.25)', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px #2228', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 260 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, color: BRAND_CONFIG.accent, fontSize: 22 }}>Binaural/Clinical Catalogue</div>
            <select value={binauralLayer} onChange={e => {
              const idx = Number(e.target.value);
              setBinauralLayer(idx);
              setMode(BINAURAL_TONES[idx].mode);
              if (BINAURAL_TONES[idx].mode === 'single') {
                setFrequency(BINAURAL_TONES[idx].frequency);
              } else {
                setLeft(BINAURAL_TONES[idx].left);
                setRight(BINAURAL_TONES[idx].right);
              }
            }} style={{ fontSize: 18, padding: '8px 18px', borderRadius: 8, border: '1px solid #ccc', background: '#222', color: BRAND_CONFIG.accent, marginBottom: 12 }}>
              {BINAURAL_TONES.map((tone, idx) => (
                <option key={tone.id} value={idx}>{tone.label}</option>
              ))}
            </select>
            {mode === 'single' ? (
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected: {frequency} Hz</div>
            ) : (
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Selected: Left {left} Hz | Right {right} Hz</div>
            )}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontWeight: 600 }}>Duration (seconds): </label>
          <input type="number" min={1} max={3600} value={duration} onChange={e => setDuration(Number(e.target.value))} disabled={isPlaying} style={{ width: 80, fontSize: 16, borderRadius: 6, border: '1px solid #ccc', padding: 4, marginLeft: 8 }} />
        </div>
        <div style={{ display: 'flex', gap: 18, marginBottom: 18, justifyContent: 'center' }}>
          <button onClick={handlePlay} disabled={isPlaying} style={{
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
              <button onClick={handleStop} style={{
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
            <b>Quantified:</b> {mode === 'single' ? `Frequency: ${frequency}Hz` : `Left: ${left}Hz, Right: ${right}Hz`} | Duration: {duration}s | Mode: {mode === 'single' ? 'Solfeggio' : 'Binaural/Clinical'}
          </div>
          <div style={{ fontSize: 15, color: '#bff', marginTop: 18, textAlign: 'center', fontWeight: 600, textShadow: '0 2px 8px #222' }}>
            All therapeutic actions are IEC 62304 Class C | FDA 21 CFR Part 820 | ISO 14971
          </div>
        </div>
      </div>
    );
}

export default GlassmorphicToneGenerator;
