import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WellnessIntakeService from '../services/WellnessIntakeService';
import { GlassSection, GlassCard, GlassGrid } from '../theme/GlassmorphismTheme';

const initialForm = {
  ageRange: '',
  activityLevel: '',
  goals: [],
  conditions: [],
  medications: '',
  allergies: '',
  sleepHours: '',
  hydrationLiters: '',
  dietStyle: '',
  stressLevel: '',
  mindfulness: '',
  devices: [],
  consentDataSharing: true,
  consentVoice: true,
  consentBiometrics: true,
  region: '',
  role: 'participant'
};

const goalOptions = ['stress reduction', 'better sleep', 'cardio health', 'energy boost', 'weight balance', 'focus', 'recovery'];
const conditionOptions = ['hypertension', 'diabetes', 'anxiety', 'depression', 'asthma', 'autoimmune', 'none'];
const deviceOptions = ['heart rate strap', 'smart watch', 'pulse oximeter', 'blood pressure cuff', 'thermometer'];

const WellnessIntake = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleArrayValue = (key, value) => {
    setForm((prev) => {
      const exists = prev[key].includes(value);
      const next = exists ? prev[key].filter((v) => v !== value) : [...prev[key], value];
      return { ...prev, [key]: next };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await WellnessIntakeService.submitIntake(form);
      setSuccess(true);
      setTimeout(() => navigate('/wellness-dashboard'), 900);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <GlassSection colors={{ primary: 'purple', secondary: 'blue' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">🧘‍♀️ Personalized Wellness Intake</h1>
              <p className="text-gray-200 max-w-2xl">
                Help us tailor your wellness experience across Sofie Systems and Heartware. Data is shared securely with backend insight for personalized care.
              </p>
            </div>
            <div className="text-sm text-gray-200 text-right">
              <div>Consent: Voice, Biometrics, Data Sharing</div>
              <div className="text-gray-400">Encrypted in transit (HTTPS)</div>
            </div>
          </div>
        </GlassSection>

        <GlassCard colors={{ primary: 'purple', secondary: 'blue' }}>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basics */}
            <GlassGrid cols={1} colsMd={3} gap={4}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Age Range</label>
                <select
                  value={form.ageRange}
                  onChange={(e) => updateField('ageRange', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  required
                >
                  <option value="">Select</option>
                  <option>18-24</option>
                  <option>25-34</option>
                  <option>35-44</option>
                  <option>45-54</option>
                  <option>55-64</option>
                  <option>65+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Region</label>
                <input
                  value={form.region}
                  onChange={(e) => updateField('region', e.target.value)}
                  placeholder="e.g., Europe-UK, USA-East"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Role</label>
                <select
                  value={form.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="participant">Participant</option>
                  <option value="provider">Provider</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </GlassGrid>

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-white">Goals</h3>
                <span className="text-xs text-gray-400">Select all that apply</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                  <button
                    type="button"
                    key={goal}
                    onClick={() => toggleArrayValue('goals', goal)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      form.goals.includes(goal)
                        ? 'bg-green-500/20 border-green-400 text-green-200'
                        : 'bg-white/5 border-white/20 text-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* Conditions & Devices */}
            <GlassGrid cols={1} colsMd={2} gap={6}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">Health Conditions</h3>
                  <span className="text-xs text-gray-400">Select all that apply</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conditionOptions.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => toggleArrayValue('conditions', c)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        form.conditions.includes(c)
                          ? 'bg-orange-500/20 border-orange-400 text-orange-200'
                          : 'bg-white/5 border-white/20 text-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-white">Devices in Use</h3>
                  <span className="text-xs text-gray-400">Helps auto-connect</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {deviceOptions.map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleArrayValue('devices', d)}
                      className={`px-4 py-2 rounded-full text-sm border transition ${
                        form.devices.includes(d)
                          ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                          : 'bg-white/5 border-white/20 text-gray-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </GlassGrid>

            {/* Lifestyle */}
            <GlassGrid cols={1} colsMd={3} gap={4}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Activity Level</label>
                <select
                  value={form.activityLevel}
                  onChange={(e) => updateField('activityLevel', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                  required
                >
                  <option value="">Select</option>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Sleep (hours)</label>
                <input
                  value={form.sleepHours}
                  onChange={(e) => updateField('sleepHours', e.target.value)}
                  placeholder="e.g., 7"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Hydration (L/day)</label>
                <input
                  value={form.hydrationLiters}
                  onChange={(e) => updateField('hydrationLiters', e.target.value)}
                  placeholder="e.g., 2.5"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                />
              </div>
            </GlassGrid>

            {/* Mindfulness */}
            <GlassGrid cols={1} colsMd={2} gap={4}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Stress Level (self-reported)</label>
                <select
                  value={form.stressLevel}
                  onChange={(e) => updateField('stressLevel', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="">Select</option>
                  <option>Low</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Mindfulness / Meditation</label>
                <select
                  value={form.mindfulness}
                  onChange={(e) => updateField('mindfulness', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                >
                  <option value="">Select</option>
                  <option>None</option>
                  <option>Occasional</option>
                  <option>Regular</option>
                </select>
              </div>
            </GlassGrid>

            {/* Diet & Meds */}
            <GlassGrid cols={1} colsMd={2} gap={4}>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Diet Style</label>
                <input
                  value={form.dietStyle}
                  onChange={(e) => updateField('dietStyle', e.target.value)}
                  placeholder="e.g., Mediterranean, Plant-based"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Medications / Supplements</label>
                <textarea
                  value={form.medications}
                  onChange={(e) => updateField('medications', e.target.value)}
                  placeholder="List meds or supplements"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white min-h-[80px]"
                />
              </div>
            </GlassGrid>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Allergies</label>
              <textarea
                value={form.allergies}
                onChange={(e) => updateField('allergies', e.target.value)}
                placeholder="e.g., nuts, pollen, medications"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white min-h-[80px]"
              />
            </div>

            {/* Consents */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'consentDataSharing', label: 'Share data with Heartware clinicians' },
                { key: 'consentVoice', label: 'Enable voice-based wellness analysis' },
                { key: 'consentBiometrics', label: 'Enable biometric monitoring' },
              ].map((item) => (
                <label
                  key={item.key}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    form[item.key] ? 'bg-green-500/10 border-green-400/50' : 'bg-white/5 border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form[item.key]}
                    onChange={(e) => updateField(item.key, e.target.checked)}
                    className="mt-1"
                  />
                  <span className="text-sm text-gray-200">{item.label}</span>
                </label>
              ))}
            </div>

            {/* Submit */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-gray-300">
                Data is shared across Sofie Systems + Heartware for coordinated care.
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForm(initialForm)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-gray-200 hover:bg-white/10 transition"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Save & Continue'}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-100 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-100 text-sm">
                Saved! Redirecting to Wellness Dashboard...
              </div>
            )}
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default WellnessIntake;
