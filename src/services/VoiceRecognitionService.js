/**
 * Voice Recognition Service with Wellness Intelligence
 * 
 * Features:
 * - Real-time voice command processing
 * - Voice vitals analysis (stress detection, emotion recognition)
 * - Hands-free health logging
 * - Personalized wellness recommendations via voice
 * - Integration with Web Speech API
 */

class VoiceRecognitionService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.listeners = new Set();
    this.commandHandlers = new Map();
    this.voiceVitals = {
      stressLevel: 0,
      emotionalState: 'neutral',
      energyLevel: 50,
      lastAnalyzed: null
    };
    
    this.initializeRecognition();
    this.registerDefaultCommands();
  }

  initializeRecognition() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event) => this.handleResult(event);
    this.recognition.onerror = (event) => this.handleError(event);
    this.recognition.onend = () => this.handleEnd();
  }

  registerDefaultCommands() {
    // Health vitals commands
    this.registerCommand('check vitals', () => ({
      action: 'CHECK_VITALS',
      message: 'Initiating vital signs check...'
    }));

    this.registerCommand('stress level', () => ({
      action: 'CHECK_STRESS',
      message: 'Analyzing stress levels...'
    }));

    this.registerCommand('wellness score', () => ({
      action: 'WELLNESS_SCORE',
      message: 'Calculating wellness score...'
    }));

    // Herbal consultation commands
    this.registerCommand('herbal remedy', (params) => ({
      action: 'HERBAL_CONSULTATION',
      params,
      message: 'Opening herbal consultation...'
    }));

    this.registerCommand('journal entry', (params) => ({
      action: 'CREATE_JOURNAL',
      params,
      message: 'Creating journal entry...'
    }));

    // Navigation commands
    this.registerCommand('go to dashboard', () => ({
      action: 'NAVIGATE',
      path: '/dashboard',
      message: 'Navigating to dashboard...'
    }));

    this.registerCommand('open herbal library', () => ({
      action: 'NAVIGATE',
      path: '/herbal-library',
      message: 'Opening herbal library...'
    }));

    this.registerCommand('open journal', () => ({
      action: 'NAVIGATE',
      path: '/herbal-journal',
      message: 'Opening personal journal...'
    }));

    // Emergency commands
    this.registerCommand('emergency', () => ({
      action: 'EMERGENCY',
      priority: 'HIGH',
      message: 'Emergency protocol activated'
    }));

    this.registerCommand('help', () => ({
      action: 'SHOW_HELP',
      message: 'Available commands: check vitals, stress level, wellness score, herbal remedy, journal entry, go to dashboard, emergency, help'
    }));
  }

  registerCommand(phrase, handler) {
    const normalizedPhrase = phrase.toLowerCase().trim();
    this.commandHandlers.set(normalizedPhrase, handler);
  }

  handleResult(event) {
    const results = Array.from(event.results);
    const latest = results[results.length - 1];
    const transcript = latest[0].transcript.toLowerCase().trim();
    const isFinal = latest.isFinal;

    // Notify listeners of interim results
    this.notifyListeners({
      type: 'TRANSCRIPT',
      transcript,
      isFinal,
      confidence: latest[0].confidence
    });

    if (isFinal) {
      // Analyze voice vitals
      this.analyzeVoiceVitals(transcript, latest[0].confidence);

      // Process commands
      const command = this.matchCommand(transcript);
      if (command) {
        this.notifyListeners({
          type: 'COMMAND',
          ...command
        });
      } else {
        // No exact match - try AI interpretation
        this.notifyListeners({
          type: 'TEXT_INPUT',
          text: transcript
        });
      }
    }
  }

  matchCommand(transcript) {
    // Exact match
    for (const [phrase, handler] of this.commandHandlers) {
      if (transcript.includes(phrase)) {
        const params = transcript.replace(phrase, '').trim();
        return handler(params);
      }
    }

    // Fuzzy match for common variations
    const fuzzyMatches = {
      'vital': 'check vitals',
      'stressed': 'stress level',
      'wellness': 'wellness score',
      'herb': 'herbal remedy',
      'write': 'journal entry',
      'dashboard': 'go to dashboard',
      'library': 'open herbal library',
      'journal': 'open journal'
    };

    for (const [keyword, command] of Object.entries(fuzzyMatches)) {
      if (transcript.includes(keyword)) {
        const handler = this.commandHandlers.get(command);
        if (handler) {
          return handler(transcript);
        }
      }
    }

    return null;
  }

  analyzeVoiceVitals(transcript, confidence) {
    // Simple heuristic-based voice analysis
    // In production, this would use ML models
    
    const stressKeywords = ['stressed', 'anxious', 'worried', 'panic', 'overwhelmed', 'tired', 'exhausted'];
    const positiveKeywords = ['great', 'good', 'happy', 'excellent', 'wonderful', 'calm', 'relaxed'];
    const negativeKeywords = ['bad', 'terrible', 'awful', 'pain', 'hurt', 'sick', 'ill'];

    let stressScore = 0;
    let emotionalScore = 0;

    // Analyze word choice
    stressKeywords.forEach(word => {
      if (transcript.includes(word)) stressScore += 20;
    });

    positiveKeywords.forEach(word => {
      if (transcript.includes(word)) emotionalScore += 15;
    });

    negativeKeywords.forEach(word => {
      if (transcript.includes(word)) emotionalScore -= 15;
    });

    // Analyze speech confidence (low confidence might indicate stress/fatigue)
    if (confidence < 0.7) {
      stressScore += 10;
    }

    // Update vitals
    this.voiceVitals = {
      stressLevel: Math.min(100, Math.max(0, stressScore)),
      emotionalState: emotionalScore > 10 ? 'positive' : emotionalScore < -10 ? 'negative' : 'neutral',
      energyLevel: 100 - stressScore, // Inverse relationship
      lastAnalyzed: new Date().toISOString(),
      confidence
    };

    // Notify wellness changes
    this.notifyListeners({
      type: 'VOICE_VITALS',
      vitals: this.voiceVitals
    });
  }

  handleError(event) {
    console.error('Speech recognition error:', event.error);
    this.notifyListeners({
      type: 'ERROR',
      error: event.error,
      message: this.getErrorMessage(event.error)
    });
  }

  handleEnd() {
    if (this.isListening) {
      // Auto-restart if still in listening mode
      this.recognition?.start();
    }
  }

  getErrorMessage(error) {
    const errorMessages = {
      'no-speech': 'No speech detected. Please try again.',
      'audio-capture': 'Microphone not accessible. Please check permissions.',
      'not-allowed': 'Microphone access denied. Please enable in browser settings.',
      'network': 'Network error. Please check your connection.',
      'aborted': 'Speech recognition aborted.',
      'service-not-allowed': 'Speech recognition service not allowed.'
    };

    return errorMessages[error] || `Speech recognition error: ${error}`;
  }

  start() {
    if (!this.recognition) {
      console.error('Speech recognition not initialized');
      return false;
    }

    if (this.isListening) {
      console.warn('Already listening');
      return false;
    }

    try {
      this.recognition.start();
      this.isListening = true;
      this.notifyListeners({
        type: 'STATUS',
        status: 'listening',
        message: 'Voice recognition activated'
      });
      return true;
    } catch (error) {
      console.error('Failed to start recognition:', error);
      return false;
    }
  }

  stop() {
    if (!this.isListening) return false;

    try {
      this.recognition?.stop();
      this.isListening = false;
      this.notifyListeners({
        type: 'STATUS',
        status: 'stopped',
        message: 'Voice recognition deactivated'
      });
      return true;
    } catch (error) {
      console.error('Failed to stop recognition:', error);
      return false;
    }
  }

  toggle() {
    return this.isListening ? this.stop() : this.start();
  }

  getVoiceVitals() {
    return { ...this.voiceVitals };
  }

  getWellnessRecommendations() {
    const { stressLevel, emotionalState, energyLevel } = this.voiceVitals;

    const recommendations = [];

    if (stressLevel > 60) {
      recommendations.push({
        category: 'stress_management',
        title: 'High Stress Detected',
        message: 'Consider trying chamomile tea or lavender aromatherapy',
        urgency: 'high',
        herbs: ['chamomile', 'lavender', 'ashwagandha']
      });
    }

    if (emotionalState === 'negative') {
      recommendations.push({
        category: 'emotional_wellness',
        title: 'Emotional Support',
        message: 'St. John\'s Wort and lemon balm may help improve mood',
        urgency: 'medium',
        herbs: ['st-johns-wort', 'lemon-balm', 'holy-basil']
      });
    }

    if (energyLevel < 40) {
      recommendations.push({
        category: 'energy_boost',
        title: 'Low Energy Detected',
        message: 'Try ginseng or green tea for natural energy support',
        urgency: 'medium',
        herbs: ['ginseng', 'green-tea', 'rhodiola']
      });
    }

    return recommendations;
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event) {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Listener error:', error);
      }
    });
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  getStatus() {
    return {
      supported: this.isSupported(),
      listening: this.isListening,
      vitals: this.voiceVitals,
      commands: Array.from(this.commandHandlers.keys())
    };
  }
}

// Singleton instance
const voiceRecognitionService = new VoiceRecognitionService();

export default voiceRecognitionService;
