/**
 * Biometrics Service with Wellness Intelligence
 * 
 * Features:
 * - Real-time biometric monitoring (heart rate, blood pressure, temperature, SpO2)
 * - Wellness score calculation
 * - Trend analysis and anomaly detection
 * - Integration with wearable devices (simulated for now)
 * - Personalized health insights
 */

class BiometricsService {
  constructor() {
    this.currentReadings = {
      heartRate: null,
      bloodPressure: { systolic: null, diastolic: null },
      temperature: null,
      spO2: null, // Blood oxygen saturation
      respiratoryRate: null,
      stressIndex: null,
      timestamp: null
    };

    this.history = [];
    this.listeners = new Set();
    this.isMonitoring = false;
    this.monitoringInterval = null;
    this.baselines = this.loadBaselines();
  }

  loadBaselines() {
    // Load user baselines from localStorage or use defaults
    const stored = localStorage.getItem('biometrics_baselines');
    if (stored) {
      return JSON.parse(stored);
    }

    return {
      heartRate: { min: 60, max: 100, optimal: 70 },
      bloodPressure: { 
        systolic: { min: 90, max: 120, optimal: 110 },
        diastolic: { min: 60, max: 80, optimal: 70 }
      },
      temperature: { min: 36.1, max: 37.2, optimal: 36.8 }, // Celsius
      spO2: { min: 95, max: 100, optimal: 98 },
      respiratoryRate: { min: 12, max: 20, optimal: 16 }
    };
  }

  saveBaselines() {
    localStorage.setItem('biometrics_baselines', JSON.stringify(this.baselines));
  }

  // Simulate biometric readings (replace with actual device integration)
  async getDeviceReadings() {
    // In production, this would connect to actual biometric devices
    // For now, simulate realistic readings with some variance
    
    const variance = (base, range) => base + (Math.random() - 0.5) * range;
    
    return {
      heartRate: Math.round(variance(72, 10)),
      bloodPressure: {
        systolic: Math.round(variance(115, 15)),
        diastolic: Math.round(variance(75, 10))
      },
      temperature: parseFloat(variance(36.8, 0.6).toFixed(1)),
      spO2: Math.round(variance(98, 3)),
      respiratoryRate: Math.round(variance(16, 4)),
      timestamp: new Date().toISOString()
    };
  }

  async takeSingleReading() {
    const readings = await this.getDeviceReadings();
    
    // Calculate stress index based on heart rate variability and other factors
    const stressIndex = this.calculateStressIndex(readings);
    readings.stressIndex = stressIndex;

    this.currentReadings = readings;
    this.addToHistory(readings);

    // Analyze for anomalies
    const analysis = this.analyzeReadings(readings);

    const event = {
      type: 'READING',
      readings,
      analysis,
      wellness: this.calculateWellnessScore(readings)
    };

    this.notifyListeners(event);

    return event;
  }

  calculateStressIndex(readings) {
    // Stress index based on multiple factors (0-100 scale)
    let stress = 0;

    // Heart rate deviation from optimal
    const hrDeviation = Math.abs(readings.heartRate - this.baselines.heartRate.optimal);
    stress += (hrDeviation / 30) * 30; // Max 30 points

    // Blood pressure deviation
    const bpDeviation = Math.abs(readings.bloodPressure.systolic - this.baselines.bloodPressure.systolic.optimal);
    stress += (bpDeviation / 20) * 25; // Max 25 points

    // Respiratory rate deviation
    const rrDeviation = Math.abs(readings.respiratoryRate - this.baselines.respiratoryRate.optimal);
    stress += (rrDeviation / 5) * 20; // Max 20 points

    // Temperature deviation
    const tempDeviation = Math.abs(readings.temperature - this.baselines.temperature.optimal);
    stress += (tempDeviation / 1) * 15; // Max 15 points

    // SpO2 deviation (lower is worse)
    const spO2Deviation = this.baselines.spO2.optimal - readings.spO2;
    if (spO2Deviation > 0) {
      stress += (spO2Deviation / 3) * 10; // Max 10 points
    }

    return Math.min(100, Math.max(0, Math.round(stress)));
  }

  calculateWellnessScore(readings) {
    // Wellness score (0-100, higher is better)
    let wellness = 100;

    // Heart rate assessment
    if (readings.heartRate < this.baselines.heartRate.min || readings.heartRate > this.baselines.heartRate.max) {
      wellness -= 15;
    } else {
      const hrDeviation = Math.abs(readings.heartRate - this.baselines.heartRate.optimal);
      wellness -= (hrDeviation / 40) * 10;
    }

    // Blood pressure assessment
    const bpOutOfRange = 
      readings.bloodPressure.systolic > this.baselines.bloodPressure.systolic.max ||
      readings.bloodPressure.diastolic > this.baselines.bloodPressure.diastolic.max;
    
    if (bpOutOfRange) {
      wellness -= 20;
    }

    // Temperature assessment
    if (readings.temperature > 37.5 || readings.temperature < 36.0) {
      wellness -= 15;
    }

    // SpO2 assessment
    if (readings.spO2 < 95) {
      wellness -= 20;
    }

    // Stress index impact
    wellness -= readings.stressIndex * 0.2;

    return Math.min(100, Math.max(0, Math.round(wellness)));
  }

  analyzeReadings(readings) {
    const alerts = [];
    const recommendations = [];

    // Heart rate analysis
    if (readings.heartRate > this.baselines.heartRate.max) {
      alerts.push({
        severity: 'warning',
        metric: 'heartRate',
        message: 'Elevated heart rate detected',
        value: readings.heartRate
      });
      recommendations.push({
        category: 'cardiovascular',
        title: 'Heart Rate Management',
        message: 'Try hawthorn berry or CoQ10 for cardiovascular support',
        herbs: ['hawthorn', 'coq10', 'garlic']
      });
    } else if (readings.heartRate < this.baselines.heartRate.min) {
      alerts.push({
        severity: 'info',
        metric: 'heartRate',
        message: 'Lower than normal heart rate',
        value: readings.heartRate
      });
    }

    // Blood pressure analysis
    if (readings.bloodPressure.systolic > 130 || readings.bloodPressure.diastolic > 85) {
      alerts.push({
        severity: 'warning',
        metric: 'bloodPressure',
        message: 'Elevated blood pressure detected',
        value: `${readings.bloodPressure.systolic}/${readings.bloodPressure.diastolic}`
      });
      recommendations.push({
        category: 'cardiovascular',
        title: 'Blood Pressure Support',
        message: 'Hibiscus tea and celery seed may help regulate blood pressure',
        herbs: ['hibiscus', 'celery-seed', 'olive-leaf']
      });
    }

    // Temperature analysis
    if (readings.temperature > 37.5) {
      alerts.push({
        severity: readings.temperature > 38.0 ? 'critical' : 'warning',
        metric: 'temperature',
        message: 'Elevated temperature detected',
        value: readings.temperature
      });
      recommendations.push({
        category: 'immune_support',
        title: 'Fever Management',
        message: 'Elderberry and echinacea may support immune response',
        herbs: ['elderberry', 'echinacea', 'yarrow']
      });
    }

    // SpO2 analysis
    if (readings.spO2 < 95) {
      alerts.push({
        severity: readings.spO2 < 90 ? 'critical' : 'warning',
        metric: 'spO2',
        message: 'Low blood oxygen saturation',
        value: readings.spO2
      });
      recommendations.push({
        category: 'respiratory',
        title: 'Oxygen Support',
        message: 'Cordyceps and ginkgo may support oxygen circulation',
        herbs: ['cordyceps', 'ginkgo', 'ginseng']
      });
    }

    // Stress analysis
    if (readings.stressIndex > 60) {
      alerts.push({
        severity: 'warning',
        metric: 'stress',
        message: 'High stress levels detected',
        value: readings.stressIndex
      });
      recommendations.push({
        category: 'stress_management',
        title: 'Stress Reduction',
        message: 'Ashwagandha and holy basil are adaptogens that help manage stress',
        herbs: ['ashwagandha', 'holy-basil', 'rhodiola']
      });
    }

    return {
      alerts,
      recommendations,
      overallStatus: alerts.some(a => a.severity === 'critical') ? 'critical' :
                     alerts.some(a => a.severity === 'warning') ? 'warning' : 'normal'
    };
  }

  addToHistory(readings) {
    this.history.push(readings);

    // Keep last 100 readings
    if (this.history.length > 100) {
      this.history = this.history.slice(-100);
    }

    // Save to localStorage
    this.saveHistory();
  }

  saveHistory() {
    const recentHistory = this.history.slice(-50); // Save last 50 readings
    localStorage.setItem('biometrics_history', JSON.stringify(recentHistory));
  }

  loadHistory() {
    const stored = localStorage.getItem('biometrics_history');
    if (stored) {
      this.history = JSON.parse(stored);
    }
  }

  getTrends(hours = 24) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    const recentReadings = this.history.filter(r => new Date(r.timestamp) > cutoff);

    if (recentReadings.length < 2) {
      return null;
    }

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

    return {
      heartRate: {
        average: Math.round(avg(recentReadings.map(r => r.heartRate))),
        min: Math.min(...recentReadings.map(r => r.heartRate)),
        max: Math.max(...recentReadings.map(r => r.heartRate))
      },
      bloodPressure: {
        systolic: Math.round(avg(recentReadings.map(r => r.bloodPressure.systolic))),
        diastolic: Math.round(avg(recentReadings.map(r => r.bloodPressure.diastolic)))
      },
      temperature: parseFloat(avg(recentReadings.map(r => r.temperature)).toFixed(1)),
      spO2: Math.round(avg(recentReadings.map(r => r.spO2))),
      stressIndex: Math.round(avg(recentReadings.map(r => r.stressIndex || 0)))
    };
  }

  startMonitoring(intervalMinutes = 5) {
    if (this.isMonitoring) {
      console.warn('Already monitoring');
      return false;
    }

    this.isMonitoring = true;
    
    // Take immediate reading
    this.takeSingleReading();

    // Schedule periodic readings
    this.monitoringInterval = setInterval(() => {
      this.takeSingleReading();
    }, intervalMinutes * 60 * 1000);

    this.notifyListeners({
      type: 'STATUS',
      status: 'monitoring',
      interval: intervalMinutes
    });

    return true;
  }

  stopMonitoring() {
    if (!this.isMonitoring) return false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.isMonitoring = false;

    this.notifyListeners({
      type: 'STATUS',
      status: 'stopped'
    });

    return true;
  }

  getCurrentReadings() {
    return { ...this.currentReadings };
  }

  getHistory(limit = 50) {
    return this.history.slice(-limit);
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

  exportData() {
    return {
      currentReadings: this.currentReadings,
      history: this.history,
      baselines: this.baselines,
      exportDate: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.history) this.history = data.history;
    if (data.baselines) this.baselines = data.baselines;
    if (data.currentReadings) this.currentReadings = data.currentReadings;
    this.saveHistory();
    this.saveBaselines();
  }
}

// Singleton instance
const biometricsService = new BiometricsService();

// Load history on initialization
biometricsService.loadHistory();

export default biometricsService;
