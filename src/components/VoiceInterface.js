import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import voiceRecognitionService from '../services/VoiceRecognitionService';

const VoiceInterface = ({ onCommand, compact = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isInterim, setIsInterim] = useState(false);
  const [lastCommand, setLastCommand] = useState(null);
  const [voiceVitals, setVoiceVitals] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [supported, setSupported] = useState(true);
  const navigate = useNavigate();
  const transcriptRef = useRef(null);

  const handleCommandAction = useCallback((command) => {
    if (command.action === 'NAVIGATE' && command.path) {
      navigate(command.path);
    }

    if (onCommand) {
      onCommand(command);
    }
  }, [navigate, onCommand]);

  useEffect(() => {
    setSupported(voiceRecognitionService.isSupported());

    const unsubscribe = voiceRecognitionService.subscribe((event) => {
      switch (event.type) {
        case 'TRANSCRIPT':
          setTranscript(event.transcript);
          setIsInterim(!event.isFinal);

          if (transcriptRef.current) {
            transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
          }
          break;

        case 'COMMAND':
          setLastCommand(event);
          handleCommandAction(event);
          setTimeout(() => setTranscript(''), 2000);
          break;

        case 'VOICE_VITALS':
          setVoiceVitals(event.vitals);
          setRecommendations(voiceRecognitionService.getWellnessRecommendations());
          break;

        case 'TEXT_INPUT':
          if (onCommand) {
            onCommand({ type: 'TEXT', text: event.text });
          }
          break;

        case 'STATUS':
          setIsListening(event.status === 'listening');
          if (event.status === 'listening') setError(null);
          break;

        case 'ERROR':
          setError(event.message);
          setIsListening(false);
          break;

        default:
          break;
      }
    });

    return unsubscribe;
  }, [handleCommandAction, onCommand]);

  const toggleListening = () => {
    voiceRecognitionService.toggle();
  };

  const getStressColor = (level) => {
    if (level > 60) return 'text-red-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getEmotionEmoji = (emotion) => {
    switch (emotion) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  if (!supported) {
    return (
      <div className="glassmorphic p-6 rounded-2xl">
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎤</div>
          <div className="text-lg font-semibold mb-2">Voice Recognition Not Supported</div>
          <div className="text-sm text-gray-400">
            Your browser doesn't support voice recognition. Please try Chrome, Edge, or Safari.
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="glassmorphic p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleListening}
              className={`p-3 rounded-full transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'
              }`}
            >
              🎤
            </button>
            <div>
              <div className="text-sm font-semibold">
                {isListening ? 'Listening...' : 'Voice Assistant'}
              </div>
              {voiceVitals && (
                <div className="text-xs text-gray-400">
                  Stress: <span className={getStressColor(voiceVitals.stressLevel)}>
                    {voiceVitals.stressLevel}%
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {transcript && (
            <div className={`text-sm ${isInterim ? 'text-gray-400 italic' : 'text-white'}`}>
              "{transcript.substring(0, 30)}..."
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphic p-6 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🎤 Voice Interface
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Voice-activated wellness assistant
          </p>
        </div>
        
        <button
          onClick={toggleListening}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            isListening 
              ? 'bg-red-500 animate-pulse' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90'
          }`}
        >
          {isListening ? '🛑 Stop Listening' : '🎤 Start Listening'}
        </button>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glassmorphic-light p-4 rounded-lg">
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
            <span className="font-semibold">{isListening ? 'Active' : 'Inactive'}</span>
          </div>
        </div>

        {voiceVitals && (
          <>
            <div className="glassmorphic-light p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Stress Level</div>
              <div className={`text-2xl font-bold ${getStressColor(voiceVitals.stressLevel)}`}>
                {voiceVitals.stressLevel}%
              </div>
            </div>

            <div className="glassmorphic-light p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Emotional State</div>
              <div className="text-2xl font-bold">
                {getEmotionEmoji(voiceVitals.emotionalState)} {voiceVitals.emotionalState}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Transcript Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">💬 Live Transcript</h3>
        <div
          ref={transcriptRef}
          className="glassmorphic-light p-4 rounded-lg min-h-[120px] max-h-[200px] overflow-y-auto"
        >
          {transcript ? (
            <p className={`${isInterim ? 'text-gray-400 italic' : 'text-white'}`}>
              {transcript}
            </p>
          ) : (
            <p className="text-gray-500 text-center py-8">
              {isListening ? 'Say something...' : 'Click "Start Listening" to begin'}
            </p>
          )}
        </div>
      </div>

      {/* Last Command */}
      {lastCommand && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">✅ Last Command</h3>
          <div className="glassmorphic-light p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">{lastCommand.action.replace(/_/g, ' ')}</span>
              <span className="text-xs text-gray-400">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-300">{lastCommand.message}</p>
          </div>
        </div>
      )}

      {/* Wellness Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">💡 Voice-Based Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  rec.urgency === 'high' 
                    ? 'bg-red-500/20 border-red-500/40' 
                    : 'bg-blue-500/20 border-blue-500/40'
                }`}
              >
                <div className="font-semibold mb-1">{rec.title}</div>
                <p className="text-sm text-gray-300 mb-2">{rec.message}</p>
                <div className="flex flex-wrap gap-2">
                  {rec.herbs.map((herb, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-500/20 border border-green-500/40 rounded-full text-xs"
                    >
                      🌿 {herb}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Commands */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">📋 Available Commands</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { cmd: 'check vitals', desc: 'Check vital signs' },
            { cmd: 'stress level', desc: 'Analyze stress' },
            { cmd: 'wellness score', desc: 'Get wellness score' },
            { cmd: 'herbal remedy', desc: 'Find herbal solutions' },
            { cmd: 'journal entry', desc: 'Create journal entry' },
            { cmd: 'go to dashboard', desc: 'Navigate to dashboard' },
            { cmd: 'open herbal library', desc: 'Browse herbs' },
            { cmd: 'emergency', desc: 'Emergency protocol' },
            { cmd: 'help', desc: 'Show all commands' }
          ].map((item, index) => (
            <div
              key={index}
              className="glassmorphic-light p-3 rounded-lg text-sm"
            >
              <div className="font-mono text-purple-400 mb-1">"{item.cmd}"</div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <div>
              <div className="font-semibold">Error</div>
              <div className="text-sm text-gray-300">{error}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceInterface;
