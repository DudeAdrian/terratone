/**
 * sofie-backend Bridge — API Layer Integration
 * 
 * Connects terratone to sofie-backend for:
 * - Wellness check-ins (Pillar 2)
 * - Evidence queries (Pillar 1)
 * - Somatic ledger (Pillar 7)
 */

const SOFIE_BACKEND_URL = process.env.SOFIE_BACKEND_URL || 'http://localhost:8000';

class SofieBackendClient {
  constructor() {
    this.apiUrl = SOFIE_BACKEND_URL;
    this.connected = false;
  }

  async connect() {
    try {
      const response = await fetch(`${this.apiUrl}/health`);
      this.connected = response.ok;
      console.log('[SofieBackendClient] Connected to API Layer');
      return this.connected;
    } catch (error) {
      console.error('[SofieBackendClient] Connection failed:', error);
      return false;
    }
  }

  async checkIn(message, consent = true, history = []) {
    if (!this.connected) return null;
    
    const response = await fetch(`${this.apiUrl}/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        consent,
        chat_history: history
      })
    });
    
    return response.json();
  }

  async queryEvidence(intent) {
    if (!this.connected) return [];
    
    const response = await fetch(`${this.apiUrl}/p1/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent })
    });
    
    return response.json();
  }

  async logSomaticEntry(data) {
    if (!this.connected) return false;
    
    const response = await fetch(`${this.apiUrl}/p7/ledger/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    return response.ok;
  }

  async getPeaceCurve() {
    if (!this.connected) return null;
    
    const response = await fetch(`${this.apiUrl}/p7/ledger/peace-curve`);
    return response.json();
  }
}

module.exports = new SofieBackendClient();
