# 🧘‍♀️ Wellness Intelligence System - Complete Guide

## Overview

The Wellness Intelligence System integrates **voice recognition** and **biometric monitoring** with AI-powered wellness recommendations for the SOFIE Systems platform. This system provides real-time health tracking, voice-activated commands, and personalized herbal remedy suggestions.

---

## 🎯 Features

### Voice Recognition Service
- **Real-time Speech Recognition**: Continuous voice command processing using Web Speech API
- **Wellness Commands**: Health-specific voice commands (check vitals, stress analysis, etc.)
- **Voice Vitals Analysis**: Stress detection and emotional state recognition from speech patterns
- **Natural Language Processing**: Fuzzy matching for command variations
- **Navigation Control**: Hands-free navigation throughout the app
- **Emergency Protocol**: Voice-activated emergency alerts

### Biometrics Monitoring Service
- **Real-time Vitals**: Heart rate, blood pressure, temperature, SpO2, respiratory rate
- **Wellness Scoring**: 0-100 overall health score based on multiple metrics
- **Stress Index**: Calculated from heart rate variability and other factors
- **Trend Analysis**: 24-hour historical tracking and pattern detection
- **Anomaly Detection**: Automatic alerts for out-of-range vitals
- **Personalized Recommendations**: AI-suggested herbal remedies based on readings

---

## 📁 File Structure

```
src/
├── services/
│   ├── VoiceRecognitionService.js    # Voice command processing & analysis
│   └── BiometricsService.js          # Biometric monitoring & wellness scoring
├── components/
│   ├── VoiceInterface.js             # Voice UI component
│   └── BiometricsMonitor.js          # Biometric display component
└── pages/
    └── WellnessDashboard.js          # Integrated wellness dashboard
```

---

## 🚀 Quick Start

### 1. Enable Voice Recognition

```javascript
import voiceRecognitionService from '../services/VoiceRecognitionService';

// Start listening
voiceRecognitionService.start();

// Subscribe to events
const unsubscribe = voiceRecognitionService.subscribe((event) => {
  if (event.type === 'COMMAND') {
    console.log('Command received:', event.action);
  }
});

// Stop listening
voiceRecognitionService.stop();
```

### 2. Take Biometric Readings

```javascript
import biometricsService from '../services/BiometricsService';

// Take single reading
const result = await biometricsService.takeSingleReading();
console.log('Wellness Score:', result.wellness);
console.log('Readings:', result.readings);
console.log('Recommendations:', result.analysis.recommendations);

// Start continuous monitoring (every 5 minutes)
biometricsService.startMonitoring(5);

// Subscribe to updates
const unsubscribe = biometricsService.subscribe((event) => {
  if (event.type === 'READING') {
    console.log('New reading:', event.readings);
  }
});
```

### 3. Use React Components

```javascript
import BiometricsMonitor from '../components/BiometricsMonitor';
import VoiceInterface from '../components/VoiceInterface';

function MyPage() {
  const handleAlert = (alert) => {
    console.log('Health alert:', alert);
  };

  const handleCommand = (command) => {
    console.log('Voice command:', command);
  };

  return (
    <div>
      <BiometricsMonitor compact={false} onAlert={handleAlert} />
      <VoiceInterface compact={false} onCommand={handleCommand} />
    </div>
  );
}
```

---

## 🎤 Voice Commands

### Health & Vitals
- **"check vitals"** - Initiates biometric reading
- **"stress level"** - Analyzes current stress from voice patterns
- **"wellness score"** - Displays overall wellness score

### Herbal Consultation
- **"herbal remedy"** - Opens herbal library with recommendations
- **"journal entry"** - Creates new journal entry (hands-free)

### Navigation
- **"go to dashboard"** - Navigate to main dashboard
- **"open herbal library"** - Browse herbal remedies
- **"open journal"** - View personal journal

### Emergency
- **"emergency"** - Activates emergency protocol
- **"help"** - Shows all available commands

### Fuzzy Matching
The system recognizes variations:
- "vital" → "check vitals"
- "stressed" → "stress level"
- "herb" → "herbal remedy"
- etc.

---

## 📊 Biometric Metrics

### Core Vitals

| Metric | Normal Range | Optimal | Alert Threshold |
|--------|-------------|---------|-----------------|
| **Heart Rate** | 60-100 BPM | 70 BPM | <60 or >100 |
| **Blood Pressure** | 90-120/60-80 mmHg | 110/70 | >130/85 |
| **Temperature** | 36.1-37.2°C | 36.8°C | >37.5°C |
| **SpO2** | 95-100% | 98% | <95% |
| **Respiratory Rate** | 12-20 /min | 16 /min | <12 or >20 |
| **Stress Index** | 0-100 | <30 | >60 |

### Wellness Score Calculation

The wellness score (0-100) is calculated based on:

1. **Heart Rate Deviation** (15 points max)
   - Within range: Full points
   - Outside range or far from optimal: Deduction

2. **Blood Pressure** (20 points max)
   - Out of range: -20 points
   - Optimal: Full points

3. **Temperature** (15 points max)
   - Fever (>37.5°C): -15 points
   - Hypothermia (<36.0°C): -15 points

4. **SpO2** (20 points max)
   - <95%: -20 points
   - ≥95%: Full points

5. **Stress Index** (20 points max)
   - Stress × 0.2 deduction
   - High stress significantly impacts score

6. **Overall Health** (10 points baseline)

---

## 🌿 Herbal Recommendations System

### Recommendation Categories

**Stress Management** (Stress Index > 60)
- Chamomile
- Lavender
- Ashwagandha

**Emotional Wellness** (Negative emotional state)
- St. John's Wort
- Lemon Balm
- Holy Basil

**Energy Boost** (Energy Level < 40)
- Ginseng
- Green Tea
- Rhodiola

**Cardiovascular Support** (Elevated heart rate or BP)
- Hawthorn Berry
- CoQ10
- Garlic

**Immune Support** (Elevated temperature)
- Elderberry
- Echinacea
- Yarrow

**Respiratory Support** (Low SpO2)
- Cordyceps
- Ginkgo
- Ginseng

---

## 🔧 API Reference

### VoiceRecognitionService

#### Methods

```javascript
// Start/stop listening
voiceRecognitionService.start()
voiceRecognitionService.stop()
voiceRecognitionService.toggle()

// Register custom command
voiceRecognitionService.registerCommand('custom phrase', (params) => ({
  action: 'CUSTOM_ACTION',
  params,
  message: 'Custom action triggered'
}))

// Get status
const status = voiceRecognitionService.getStatus()
// Returns: { supported, listening, vitals, commands }

// Get voice vitals
const vitals = voiceRecognitionService.getVoiceVitals()
// Returns: { stressLevel, emotionalState, energyLevel, lastAnalyzed }

// Get recommendations
const recs = voiceRecognitionService.getWellnessRecommendations()
// Returns: [{ category, title, message, urgency, herbs }]

// Subscribe to events
const unsubscribe = voiceRecognitionService.subscribe((event) => {
  // Handle: TRANSCRIPT, COMMAND, VOICE_VITALS, STATUS, ERROR, TEXT_INPUT
})
```

#### Event Types

**TRANSCRIPT**
```javascript
{
  type: 'TRANSCRIPT',
  transcript: 'check vitals',
  isFinal: true,
  confidence: 0.95
}
```

**COMMAND**
```javascript
{
  type: 'COMMAND',
  action: 'CHECK_VITALS',
  message: 'Initiating vital signs check...',
  params: 'optional params'
}
```

**VOICE_VITALS**
```javascript
{
  type: 'VOICE_VITALS',
  vitals: {
    stressLevel: 35,
    emotionalState: 'positive',
    energyLevel: 65,
    lastAnalyzed: '2025-12-09T...',
    confidence: 0.92
  }
}
```

### BiometricsService

#### Methods

```javascript
// Take readings
const result = await biometricsService.takeSingleReading()
// Returns: { type: 'READING', readings, analysis, wellness }

// Continuous monitoring
biometricsService.startMonitoring(5) // 5 minute intervals
biometricsService.stopMonitoring()

// Get current data
const readings = biometricsService.getCurrentReadings()
const history = biometricsService.getHistory(50) // last 50 readings
const trends = biometricsService.getTrends(24) // 24 hour trends

// Data management
const exportData = biometricsService.exportData()
biometricsService.importData(exportData)

// Subscribe to events
const unsubscribe = biometricsService.subscribe((event) => {
  // Handle: READING, STATUS
})
```

#### Data Structures

**Readings Object**
```javascript
{
  heartRate: 72,
  bloodPressure: { systolic: 115, diastolic: 75 },
  temperature: 36.8,
  spO2: 98,
  respiratoryRate: 16,
  stressIndex: 35,
  timestamp: '2025-12-09T...'
}
```

**Analysis Object**
```javascript
{
  alerts: [
    {
      severity: 'warning', // or 'critical', 'info'
      metric: 'heartRate',
      message: 'Elevated heart rate detected',
      value: 105
    }
  ],
  recommendations: [
    {
      category: 'stress_management',
      title: 'High Stress Detected',
      message: 'Consider chamomile tea or lavender',
      herbs: ['chamomile', 'lavender', 'ashwagandha']
    }
  ],
  overallStatus: 'warning' // 'normal', 'warning', 'critical'
}
```

**Trends Object**
```javascript
{
  heartRate: { average: 74, min: 62, max: 88 },
  bloodPressure: { systolic: 117, diastolic: 76 },
  temperature: 36.9,
  spO2: 97,
  stressIndex: 38
}
```

---

## 🎨 UI Components

### BiometricsMonitor

**Props:**
- `compact` (boolean): Compact card view vs full dashboard
- `onAlert` (function): Callback when alerts are detected

**Compact Mode:**
- Displays wellness score
- Shows heart rate and SpO2
- "View Details" button

**Full Mode:**
- All vitals with status colors
- 24-hour trends
- Alerts panel
- Herbal recommendations
- Take reading / monitoring controls

### VoiceInterface

**Props:**
- `compact` (boolean): Minimal widget vs full interface
- `onCommand` (function): Callback for voice commands

**Compact Mode:**
- Microphone toggle button
- Listening status
- Current transcript preview

**Full Mode:**
- Large microphone control
- Status indicators (listening, stress, emotion)
- Live transcript display
- Last command feedback
- Wellness recommendations from voice
- Available commands list

---

## 💾 Data Storage

### LocalStorage Keys

**Biometrics:**
- `biometrics_history` - Last 50 readings
- `biometrics_baselines` - Personalized baseline values

**Voice:**
- Voice vitals stored in memory (not persisted)

### Export Format

```json
{
  "currentReadings": { ... },
  "history": [ ... ],
  "baselines": { ... },
  "exportDate": "2025-12-09T..."
}
```

---

## 🔒 Browser Support

### Voice Recognition
- ✅ Chrome/Edge (full support)
- ✅ Safari (iOS 14.5+, macOS 12+)
- ❌ Firefox (not supported)

### Web Speech API
- Requires HTTPS (except localhost)
- Microphone permissions required
- Continuous recognition supported

---

## 🎯 Integration Examples

### With AIChat

```javascript
import voiceRecognitionService from '../services/VoiceRecognitionService';
import AICompanionService from '../services/AICompanionService';

voiceRecognitionService.subscribe(async (event) => {
  if (event.type === 'TEXT_INPUT') {
    // Send unmatched voice input to AI
    const response = await AICompanionService.chat(event.text);
    console.log('AI Response:', response);
  }
});
```

### With Herbal Journal

```javascript
import voiceRecognitionService from '../services/VoiceRecognitionService';

voiceRecognitionService.registerCommand('log symptom', (symptom) => {
  // Voice-activated symptom logging
  journalService.createEntry({
    type: 'symptom',
    description: symptom,
    timestamp: new Date()
  });
});
```

### With Dashboard Widgets

```javascript
// Home.js integration
const [showWellness, setShowWellness] = useState(false);

useEffect(() => {
  const readings = biometricsService.getCurrentReadings();
  if (readings.timestamp) {
    setShowWellness(true);
  }
}, []);

return showWellness && (
  <BiometricsMonitor compact={true} />
);
```

---

## 🧪 Simulated Data

Currently, biometric readings are **simulated** with realistic variance. To integrate real devices:

### Replace `getDeviceReadings()` in BiometricsService.js

```javascript
async getDeviceReadings() {
  // Example: Web Bluetooth API integration
  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: ['heart_rate'] }]
  });
  
  const server = await device.gatt.connect();
  const service = await server.getPrimaryService('heart_rate');
  const characteristic = await service.getCharacteristic('heart_rate_measurement');
  
  const value = await characteristic.readValue();
  const heartRate = value.getUint8(1);
  
  // Read other sensors...
  
  return {
    heartRate,
    bloodPressure: { systolic, diastolic },
    // ... other readings
  };
}
```

---

## 🚨 Alert Severity Levels

**INFO** (Blue)
- Slightly below normal heart rate
- Minor deviations from optimal

**WARNING** (Yellow)
- Elevated heart rate (>100 BPM)
- Elevated blood pressure (>130/85)
- Low-grade fever (37.5-38.0°C)
- Reduced SpO2 (92-95%)
- High stress (60-80)

**CRITICAL** (Red)
- Severe tachycardia (>120 BPM)
- Hypertensive crisis (>140/90)
- High fever (>38.0°C)
- Dangerous SpO2 (<90%)
- Extreme stress (>80)

---

## 📈 Roadmap

### Phase 1: Core System ✅
- [x] Voice recognition service
- [x] Biometrics monitoring
- [x] Wellness scoring
- [x] React components
- [x] Dashboard integration

### Phase 2: Device Integration 🔄
- [ ] Web Bluetooth API support
- [ ] Wearable device connectors (Fitbit, Apple Watch, etc.)
- [ ] Real-time sensor streaming
- [ ] Multi-device support

### Phase 3: AI Enhancement 📅
- [ ] ML-based stress detection from voice
- [ ] Predictive health analytics
- [ ] Personalized baseline calibration
- [ ] Natural language understanding improvements

### Phase 4: Clinical Features 📅
- [ ] HIPAA compliance mode
- [ ] Medical provider integration
- [ ] Prescription tracking
- [ ] Lab results integration
- [ ] Appointment scheduling

---

## 🐛 Troubleshooting

### Voice Recognition Not Working

**Problem:** "Speech Recognition not supported"
- **Solution:** Use Chrome, Edge, or Safari (latest versions)
- Check HTTPS is enabled (required for microphone access)

**Problem:** "Microphone access denied"
- **Solution:** Enable microphone permissions in browser settings
- Check system microphone settings

**Problem:** Commands not recognized
- **Solution:** Speak clearly and closer to microphone
- Check available commands list
- Try exact command phrases first

### Biometric Readings

**Problem:** Unrealistic values
- **Current:** Using simulated data with variance
- **Next Step:** Integrate real device API (see integration section)

**Problem:** Trends not showing
- **Solution:** Take at least 2 readings with time gap
- Ensure readings are being saved to localStorage

---

## 📞 Support

For issues or questions:
1. Check console for error messages
2. Verify browser compatibility
3. Check microphone/device permissions
4. Review integration examples above

---

## 🎉 Success Metrics

**System is working correctly when:**
- ✅ Voice commands trigger appropriate actions
- ✅ Biometric readings display realistic values
- ✅ Wellness score calculates (0-100 range)
- ✅ Alerts appear for out-of-range vitals
- ✅ Herbal recommendations match health status
- ✅ Data persists in localStorage
- ✅ 24-hour trends visible after multiple readings
- ✅ Navigation responds to voice commands

---

**Version:** 1.0.0  
**Last Updated:** December 9, 2025  
**Status:** ✅ Production Ready (Simulated Data)
