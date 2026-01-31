// backend/routes/integration.js
// Forwards selected smart home/ritual events to Heartware and Terracare Ledger


const express = require('express');
const axios = require('axios');
const router = express.Router();
const axiosRetry = require('axios-retry').default;
// Add retry logic to axios (3 retries, exponential backoff)
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });


// POST /api/integration/forward
router.post('/forward', async (req, res) => {
  const { event, forwardTo } = req.body;
  if (!event || !forwardTo) {
    return res.status(400).json({ error: 'Missing event or forwardTo' });
  }

  const results = {};

  // Forward to Heartware
  if (forwardTo.includes('heartware')) {
    try {
      const hwRes = await axios.post(process.env.HEARTWARE_API_URL + '/api/events', { event });
      results.heartware = hwRes.data;
    } catch (err) {
      results.heartware = { error: err.message, retry: true };
    }
  }

  // Forward to Terracare Ledger
  if (forwardTo.includes('terracare')) {
    try {
      const tcRes = await axios.post(process.env.TERRACARE_API_URL + '/api/proofs', { event });
      results.terracare = tcRes.data;
    } catch (err) {
      results.terracare = { error: err.message, retry: true };
    }
  }

  res.json(results);
});

// GET /api/integration/health
router.get('/health', async (req, res) => {
  const status = { heartware: 'offline', terracare: 'offline' };
  try {
    const hw = await axios.get(process.env.HEARTWARE_API_URL + '/health');
    if (hw.status === 200) status.heartware = 'online';
  } catch (e) {}
  try {
    const tc = await axios.get(process.env.TERRACARE_API_URL + '/health');
    if (tc.status === 200) status.terracare = 'online';
  } catch (e) {}
  res.json(status);
});

module.exports = router;
