const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';

const LOCAL_FLAG = 'wellness_intake_done';

async function submitIntake(payload) {
  const response = await fetch(`${API_BASE}/wellness-intake`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to submit wellness intake');
  }

  const data = await response.json();
  try {
    localStorage.setItem(LOCAL_FLAG, 'true');
  } catch (err) {
    console.warn('Unable to set intake flag locally', err);
  }
  return data;
}

async function getIntakeStatus() {
  try {
    const response = await fetch(`${API_BASE}/wellness-intake/me`);
    if (response.ok) {
      const data = await response.json();
      return { exists: true, data };
    }
  } catch (err) {
    // fall through to local flag
  }

  const localFlag = typeof localStorage !== 'undefined' && localStorage.getItem(LOCAL_FLAG) === 'true';
  return { exists: localFlag, data: null };
}

const WellnessIntakeService = {
  submitIntake,
  getIntakeStatus,
};

export default WellnessIntakeService;
