import React, { useState } from 'react';

/**
 * CommunityManagerDataSheet
 * Form interface for community managers to report human data
 * Includes population changes, project updates, resource availability, achievements
 * Real-time validation and submission to backend
 */
const CommunityManagerDataSheet = ({ communitySlug, onSubmit = null }) => {
  const [formData, setFormData] = useState({
    // Population & Demographics
    currentPopulation: '',
    populationChange: '',
    populationChangeReason: '',

    // Project Status
    activeProjects: '',
    projectDescription: '',
    projectStatus: 'ongoing', // ongoing, completed, paused

    // Resource Availability
    energyAvailable: '', // units or percentage
    waterAvailable: '',
    foodAvailable: '',
    medicalSupplies: '',
    skillsAvailable: '', // text field

    // Recent Achievements
    achievements: '',

    // Challenges & Needs
    currentChallenges: '',
    supportNeeded: '',

    // Contact Info
    reporterName: '',
    reporterEmail: '',
    reporterRole: '',

    // Additional Notes
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.reporterName) return 'Reporter name is required';
    if (!formData.reporterEmail) return 'Reporter email is required';
    if (!formData.currentPopulation) return 'Current population is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001/api';
      
      const reportPayload = {
        title: `Community Report - ${formData.reporterName}`,
        summary: `Population: ${formData.currentPopulation}, Status: ${formData.projectStatus}`,
        reportType: 'human',
        reportPeriod: 'daily',
        reportedBy: formData.reporterName,
        reporterEmail: formData.reporterEmail,
        reporterRole: formData.reporterRole,
        data: formData, // Store all form data as JSON
      };

      if (onSubmit) {
        // If custom handler provided, use it
        await onSubmit(reportPayload);
      } else {
        // Otherwise, POST to backend
        const response = await fetch(`${apiUrl}/communities/${communitySlug}/reports`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportPayload),
        });

        if (!response.ok) throw new Error('Failed to submit report');
      }

      setSubmitted(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          currentPopulation: '',
          populationChange: '',
          populationChangeReason: '',
          activeProjects: '',
          projectDescription: '',
          projectStatus: 'ongoing',
          energyAvailable: '',
          waterAvailable: '',
          foodAvailable: '',
          medicalSupplies: '',
          skillsAvailable: '',
          achievements: '',
          currentChallenges: '',
          supportNeeded: '',
          reporterName: '',
          reporterEmail: '',
          reporterRole: '',
          notes: '',
        });
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="data-sheet-success">
        <div className="success-icon">✓</div>
        <h2>Report Submitted Successfully</h2>
        <p>Your community data has been recorded in the SOFIE system.</p>
        <p className="success-subtitle">This will be processed with your latest metrics to update community status.</p>
      </div>
    );
  }

  return (
    <div className="community-manager-data-sheet">
      <div className="sheet-header">
        <h1>Community Data Report Form</h1>
        <p>Real-time reporting interface for community managers</p>
        <p className="sheet-instructions">Submit human data about your community's current status. This integrates with SOFIE automated metrics for comprehensive monitoring.</p>
      </div>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="data-sheet-form">
        {/* Reporter Information */}
        <section className="form-section">
          <h2>Reporter Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Your Full Name *</label>
              <input 
                type="text"
                value={formData.reporterName}
                onChange={(e) => handleInputChange('reporterName', e.target.value)}
                placeholder="e.g., James Okonkwo"
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => handleInputChange('reporterEmail', e.target.value)}
                placeholder="james@community.org"
              />
            </div>
            <div className="form-group">
              <label>Your Role</label>
              <select 
                value={formData.reporterRole}
                onChange={(e) => handleInputChange('reporterRole', e.target.value)}
              >
                <option>Community Manager</option>
                <option>Project Lead</option>
                <option>Health Coordinator</option>
                <option>Agricultural Lead</option>
                <option>Energy Manager</option>
                <option>Water Management</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </section>

        {/* Population & Demographics */}
        <section className="form-section">
          <h2>📊 Population & Demographics</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Population *</label>
              <input 
                type="number"
                value={formData.currentPopulation}
                onChange={(e) => handleInputChange('currentPopulation', e.target.value)}
                placeholder="e.g., 50000"
              />
              <small>Total current population served by your community</small>
            </div>
            <div className="form-group">
              <label>Population Change (Last 30 Days)</label>
              <input 
                type="number"
                value={formData.populationChange}
                onChange={(e) => handleInputChange('populationChange', e.target.value)}
                placeholder="e.g., +500 or -200"
              />
              <small>Net change in population (positive or negative)</small>
            </div>
            <div className="form-group full-width">
              <label>Reason for Change</label>
              <input 
                type="text"
                value={formData.populationChangeReason}
                onChange={(e) => handleInputChange('populationChangeReason', e.target.value)}
                placeholder="e.g., Migration, births, relocations"
              />
            </div>
          </div>
        </section>

        {/* Projects & Initiatives */}
        <section className="form-section">
          <h2>🏗️ Projects & Initiatives</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Active Projects (Count)</label>
              <input 
                type="number"
                value={formData.activeProjects}
                onChange={(e) => handleInputChange('activeProjects', e.target.value)}
                placeholder="e.g., 5"
              />
            </div>
            <div className="form-group">
              <label>Project Status</label>
              <select 
                value={formData.projectStatus}
                onChange={(e) => handleInputChange('projectStatus', e.target.value)}
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Recently Completed</option>
                <option value="paused">Paused/On Hold</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Current Project Description</label>
              <textarea 
                value={formData.projectDescription}
                onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                placeholder="Describe your major initiatives (renewable energy, agriculture, healthcare, etc.)"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Resource Availability */}
        <section className="form-section">
          <h2>⚡ Resource Availability</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Energy Available (units/kWh)</label>
              <input 
                type="number"
                value={formData.energyAvailable}
                onChange={(e) => handleInputChange('energyAvailable', e.target.value)}
                placeholder="e.g., 1500"
              />
              <small>Daily energy production/availability</small>
            </div>
            <div className="form-group">
              <label>Water Available (liters/person/day)</label>
              <input 
                type="number"
                value={formData.waterAvailable}
                onChange={(e) => handleInputChange('waterAvailable', e.target.value)}
                placeholder="e.g., 50"
              />
              <small>WHO standard: 50L minimum</small>
            </div>
            <div className="form-group">
              <label>Food Availability (% of needs)</label>
              <input 
                type="number"
                value={formData.foodAvailable}
                onChange={(e) => handleInputChange('foodAvailable', e.target.value)}
                placeholder="e.g., 85"
              />
              <small>Percentage of population food needs met</small>
            </div>
            <div className="form-group">
              <label>Medical Supplies Stock</label>
              <input 
                type="text"
                value={formData.medicalSupplies}
                onChange={(e) => handleInputChange('medicalSupplies', e.target.value)}
                placeholder="e.g., 60% capacity"
              />
            </div>
            <div className="form-group full-width">
              <label>Available Skills & Labor</label>
              <textarea 
                value={formData.skillsAvailable}
                onChange={(e) => handleInputChange('skillsAvailable', e.target.value)}
                placeholder="e.g., 50 skilled farmers, 20 healthcare workers, 10 engineers"
                rows={2}
              />
            </div>
          </div>
        </section>

        {/* Achievements & Impact */}
        <section className="form-section">
          <h2>🏆 Recent Achievements</h2>
          <div className="form-group full-width">
            <label>Community Achievements (Last 30 Days)</label>
            <textarea 
              value={formData.achievements}
              onChange={(e) => handleInputChange('achievements', e.target.value)}
              placeholder="e.g., Installed 50 solar panels, 200 children vaccinated, Trained 15 women farmers"
              rows={3}
            />
          </div>
        </section>

        {/* Challenges & Support Needs */}
        <section className="form-section">
          <h2>⚠️ Challenges & Support Needs</h2>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Current Challenges</label>
              <textarea 
                value={formData.currentChallenges}
                onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                placeholder="Describe any challenges (resource shortages, environmental issues, health concerns, etc.)"
                rows={3}
              />
            </div>
            <div className="form-group full-width">
              <label>Support Needed</label>
              <textarea 
                value={formData.supportNeeded}
                onChange={(e) => handleInputChange('supportNeeded', e.target.value)}
                placeholder="Specify what support your community needs (e.g., medical supplies, technology, training, resources)"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Additional Notes */}
        <section className="form-section">
          <h2>📝 Additional Notes</h2>
          <div className="form-group full-width">
            <textarea 
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional context or observations"
              rows={3}
            />
          </div>
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : '✓ Submit Community Report'}
          </button>
          <small className="disclaimer">
            Your data will be processed and integrated with automated metrics within 24 hours. 
            Critical issues are flagged immediately for resource coordination.
          </small>
        </div>
      </form>
    </div>
  );
};

export default CommunityManagerDataSheet;
