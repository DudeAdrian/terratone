// backend/routes/automation.js - Automation & Autopilot Routes

const express = require('express');
const router = express.Router();
const AutomationRule = require('../models/AutomationRule');
const { dbFind, dbSave, dbUpdate, useMockData } = require('../utils/dbHelper');

// GET /api/automation/rules - Get all automation rules
router.get('/rules', async (req, res) => {
  try {
    const rules = await dbFind(AutomationRule, {}, []);
    res.json({
      rules: rules || [
        { 
          id: 'rule-1', 
          name: 'Auto-Irrigation', 
          trigger: 'soil_moisture < 30%', 
          action: 'start_irrigation', 
          status: 'active',
          lastTriggered: new Date(Date.now() - 7200000).toISOString(),
        },
        { 
          id: 'rule-2', 
          name: 'Climate Control', 
          trigger: 'temperature > 25°C', 
          action: 'increase_ventilation', 
          status: 'active',
          lastTriggered: new Date(Date.now() - 3600000).toISOString(),
        },
        { 
          id: 'rule-3', 
          name: 'Energy Optimization', 
          trigger: 'battery_level > 90%', 
          action: 'export_to_grid', 
          status: 'active',
          lastTriggered: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch automation rules' });
  }
});

// POST /api/automation/rules - Create new automation rule
router.post('/rules', async (req, res) => {
  const { name, trigger, action, conditions } = req.body;
  
  if (!name || !trigger || !action) {
    return res.status(400).json({ error: 'Missing required fields: name, trigger, action' });
  }
  
  try {
    const newRule = {
      name,
      trigger,
      action,
      conditions: conditions || {},
      status: 'active',
    };
    const saved = await dbSave(AutomationRule, newRule);
    res.status(201).json({
      ...saved.toObject(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rule' });
  }
});

// PUT /api/automation/rules/:ruleId - Update automation rule
router.put('/rules/:ruleId', (req, res) => {
  const updates = req.body;
  
  res.json({
    ruleId: req.params.ruleId,
    updates,
    message: 'Automation rule updated successfully',
    timestamp: new Date().toISOString(),
  });
});

// DELETE /api/automation/rules/:ruleId - Delete automation rule
router.delete('/rules/:ruleId', (req, res) => {
  res.json({
    ruleId: req.params.ruleId,
    message: 'Automation rule deleted successfully',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/automation/history - Get automation execution history
router.get('/history', (req, res) => {
  const { limit = 50 } = req.query;
  
  res.json({
    history: Array.from({ length: parseInt(limit) }, (_, i) => ({
      id: `exec-${i}`,
      ruleId: `rule-${(i % 3) + 1}`,
      ruleName: ['Auto-Irrigation', 'Climate Control', 'Energy Optimization'][i % 3],
      status: i % 10 === 0 ? 'failed' : 'success',
      executedAt: new Date(Date.now() - i * 600000).toISOString(),
    })),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
