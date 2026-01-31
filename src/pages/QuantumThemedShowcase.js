import React, { useState } from 'react';
import {
  QuantumCard,
  QuantumGlassPanel,
  QuantumEnergyButton,
  QuantumMetricCard,
  QuantumChakraSpectrum,
  QuantumGlassGrid,
  QuantumModal,
  QuantumSection,
  QuantumParams,
} from '../theme/QuantumGlassTheme';

/**
 * Quantum Glassmorphism Showcase
 * Demonstrates all quantum glass components with chakra alignment
 * and quantum visual parameters
 */
export default function QuantumThemedShowcase() {
  const [selectedChakra, setSelectedChakra] = useState('heart');
  const [modalOpen, setModalOpen] = useState(false);
  const [blurLevel, setBlurLevel] = useState('medium');
  const [opacityLevel, setOpacityLevel] = useState('cloud');

  const chakras = ['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown'];
  const blurLevels = ['quantum', 'deep', 'medium', 'light', 'minimal'];
  const opacityLevels = ['quantum', 'ethereal', 'veil', 'mist', 'fog', 'haze', 'cloud', 'dense'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-950 p-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-2">
          🌌 Quantum Glassmorphism
        </h1>
        <p className="text-xl text-gray-300">
          Enhanced transparency, chakra alignment, and quantum visual parameters
        </p>
      </header>

      {/* Chakra Spectrum Selector */}
      <QuantumSection chakra="throat" className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-4">🔮 Select Chakra Energy</h2>
          <QuantumChakraSpectrum
            onChakraSelect={setSelectedChakra}
            interactive={true}
          />
          <p className="text-sm text-gray-400 mt-3">
            Selected: <span className="font-semibold text-white">{selectedChakra.toUpperCase()}</span>
          </p>
        </div>
      </QuantumSection>

      {/* Transparency Spectrum */}
      <QuantumSection chakra="solar" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">📊 Transparency Spectrum</h2>
        <p className="text-gray-300 mb-4">Experience quantum opacity levels from 5% to 40%</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {opacityLevels.map((level) => (
            <button
              key={level}
              onClick={() => setOpacityLevel(level)}
              className={`
                px-3 py-2 rounded-lg font-medium transition-all
                ${opacityLevel === level
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </QuantumSection>

      {/* Blur Depth Levels */}
      <QuantumSection chakra="third_eye" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">🌫️ Blur Depth Levels</h2>
        <p className="text-gray-300 mb-4">Adjust quantum blur depth from 8px to 48px</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {blurLevels.map((level) => (
            <button
              key={level}
              onClick={() => setBlurLevel(level)}
              className={`
                px-3 py-2 rounded-lg font-medium transition-all
                ${blurLevel === level
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </QuantumSection>

      {/* Quantum Cards Grid - Interactive */}
      <QuantumSection chakra="heart" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">💎 Quantum Glass Cards</h2>
        <QuantumGlassGrid columns={3} gap={5}>
          {chakras.map((chakra, idx) => (
            <QuantumCard
              key={chakra}
              chakra={chakra}
              blurLevel={blurLevel}
              opacityLevel={opacityLevel}
              interactive={true}
              className="h-40"
            >
              <div className="flex flex-col h-full justify-between">
                <h3 className="text-lg font-bold text-white">
                  {chakra.replace('_', ' ').toUpperCase()}
                </h3>
                <p className="text-sm text-gray-300">
                  Interactive quantum card
                </p>
              </div>
            </QuantumCard>
          ))}
        </QuantumGlassGrid>
      </QuantumSection>

      {/* Metric Cards */}
      <QuantumSection chakra="crown" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">📈 Quantum Metrics</h2>
        <QuantumGlassGrid columns={4} gap={5}>
          <QuantumMetricCard
            label="Energy Level"
            value="92"
            unit="%"
            icon="⚡"
            chakra="root"
            trend={5}
          />
          <QuantumMetricCard
            label="Flow State"
            value="87"
            unit="%"
            icon="🌊"
            chakra="sacral"
            trend={3}
          />
          <QuantumMetricCard
            label="Clarity"
            value="95"
            unit="%"
            icon="☀️"
            chakra="solar"
            trend={8}
          />
          <QuantumMetricCard
            label="Harmony"
            value="88"
            unit="%"
            icon="💚"
            chakra="heart"
            trend={-2}
          />
        </QuantumGlassGrid>
      </QuantumSection>

      {/* Quantum Glass Panel Example */}
      <QuantumSection chakra="sacral" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">🔬 Multi-Layer Panel</h2>
        <QuantumGlassPanel chakra={selectedChakra} depth="deep">
          <h3 className="text-xl font-bold text-white mb-3">
            Quantum Entanglement State
          </h3>
          <p className="text-gray-300 mb-4">
            This panel demonstrates multiple layered transparency levels,
            creating a quantum superposition effect through careful blur and opacity stacking.
          </p>
          <div className="flex gap-3">
            <QuantumEnergyButton chakra={selectedChakra} size="md">
              Action 1
            </QuantumEnergyButton>
            <QuantumEnergyButton chakra={selectedChakra} variant="outline" size="md">
              Action 2
            </QuantumEnergyButton>
          </div>
        </QuantumGlassPanel>
      </QuantumSection>

      {/* Energy Buttons Showcase */}
      <QuantumSection chakra="throat" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">⚡ Energy Buttons</h2>
        <div className="space-y-6">
          {/* Glass Variant */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Glass Variant</h3>
            <div className="flex flex-wrap gap-3">
              {chakras.map((chakra) => (
                <QuantumEnergyButton
                  key={chakra}
                  chakra={chakra}
                  variant="glass"
                  icon={['🔴', '🟠', '🟡', '💚', '🔵', '🟣', '🩷'][chakras.indexOf(chakra)]}
                >
                  {chakra}
                </QuantumEnergyButton>
              ))}
            </div>
          </div>

          {/* Solid Variant */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Solid Variant</h3>
            <div className="flex flex-wrap gap-3">
              {chakras.slice(0, 4).map((chakra) => (
                <QuantumEnergyButton
                  key={chakra}
                  chakra={chakra}
                  variant="solid"
                  size="md"
                >
                  {chakra}
                </QuantumEnergyButton>
              ))}
            </div>
          </div>

          {/* Outline Variant */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Outline Variant</h3>
            <div className="flex flex-wrap gap-3">
              {chakras.slice(3, 7).map((chakra) => (
                <QuantumEnergyButton
                  key={chakra}
                  chakra={chakra}
                  variant="outline"
                  size="md"
                >
                  {chakra}
                </QuantumEnergyButton>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Size Variants</h3>
            <div className="flex flex-wrap items-center gap-3">
              <QuantumEnergyButton chakra="heart" size="sm">
                Small
              </QuantumEnergyButton>
              <QuantumEnergyButton chakra="heart" size="md">
                Medium
              </QuantumEnergyButton>
              <QuantumEnergyButton chakra="heart" size="lg">
                Large
              </QuantumEnergyButton>
            </div>
          </div>
        </div>
      </QuantumSection>

      {/* Modal Demo */}
      <QuantumSection chakra="crown" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">🪟 Modal Window</h2>
            <p className="text-gray-300">Deep quantum glass with wave function collapse</p>
          </div>
          <QuantumEnergyButton
            chakra={selectedChakra}
            onClick={() => setModalOpen(true)}
            icon="✨"
          >
            Open Modal
          </QuantumEnergyButton>
        </div>
      </QuantumSection>

      {/* Modal */}
      <QuantumModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chakra={selectedChakra}
        size="lg"
        ariaLabel="Quantum Modal Example"
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              ✨ Quantum Modal
            </h2>
            <p className="text-gray-300">
              This modal demonstrates deep quantum glass transparency with smooth wave function
              collapse animations and chakra-aligned energy.
            </p>
          </div>

          <QuantumGlassGrid columns={2} gap={4}>
            <QuantumMetricCard
              label="Wave Function"
              value="100"
              unit="%"
              icon="〰️"
              chakra="root"
            />
            <QuantumMetricCard
              label="Superposition"
              value="87"
              unit="%"
              icon="🌌"
              chakra="throat"
            />
            <QuantumMetricCard
              label="Entanglement"
              value="94"
              unit="%"
              icon="🔗"
              chakra="crown"
            />
            <QuantumMetricCard
              label="Observation"
              value="76"
              unit="%"
              icon="👁️"
              chakra="third_eye"
            />
          </QuantumGlassGrid>

          <div className="flex gap-3 justify-end pt-4 border-t border-white/20">
            <QuantumEnergyButton
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </QuantumEnergyButton>
            <QuantumEnergyButton chakra={selectedChakra}>
              Confirm
            </QuantumEnergyButton>
          </div>
        </div>
      </QuantumModal>

      {/* Quantum Parameters Reference */}
      <QuantumSection chakra="solar" className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">📚 Quantum Parameters Reference</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Blur Levels</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">quantum</span> - 48px</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">deep</span> - 40px</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">medium</span> - 20px</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">light</span> - 12px</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">minimal</span> - 8px</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Opacity Levels</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">quantum</span> - 5%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">ethereal</span> - 8%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">veil</span> - 12%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">mist</span> - 15%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">fog</span> - 20%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">haze</span> - 25%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">cloud</span> - 30%</li>
              <li><span className="font-mono bg-black/30 px-2 py-1 rounded">dense</span> - 40%</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Chakra Colors</h3>
            <ul className="space-y-1 text-sm">
              <li><span className="inline-block w-3 h-3 rounded-full bg-red-600 mr-2"></span><span className="text-gray-300">Root (Muladhara)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-orange-600 mr-2"></span><span className="text-gray-300">Sacral (Svadhisthana)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span><span className="text-gray-300">Solar (Manipura)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-emerald-600 mr-2"></span><span className="text-gray-300">Heart (Anahata)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-sky-600 mr-2"></span><span className="text-gray-300">Throat (Vishuddha)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-purple-600 mr-2"></span><span className="text-gray-300">Third Eye (Ajna)</span></li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-pink-600 mr-2"></span><span className="text-gray-300">Crown (Sahasrara)</span></li>
            </ul>
          </div>
        </div>
      </QuantumSection>

      {/* Usage Example */}
      <QuantumSection chakra="sacral">
        <h2 className="text-2xl font-bold text-white mb-4">💻 Usage Example</h2>
        <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto border border-white/20">
          <code className="text-sm text-green-400">{`import {
  QuantumCard,
  QuantumEnergyButton,
  QuantumMetricCard,
  QuantumGlassPanel,
  QuantumChakraSpectrum,
} from '@/theme/QuantumGlassTheme';

// Heart Chakra Card
<QuantumCard 
  chakra="heart"
  blurLevel="medium"
  opacityLevel="cloud"
  glow={true}
>
  {/* Your content */}
</QuantumCard>

// Chakra-aligned Button
<QuantumEnergyButton
  chakra="throat"
  variant="glass"
  size="md"
  icon="✨"
>
  Click Me
</QuantumEnergyButton>

// Health Metric with Status
<QuantumMetricCard
  label="Heart Rate"
  value="72"
  unit="bpm"
  chakra="heart"
  status="normal"
  icon="💓"
/>`}</code>
        </pre>
      </QuantumSection>
    </div>
  );
}
