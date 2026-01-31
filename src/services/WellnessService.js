// src/services/WellnessService.js

class WellnessService {
  constructor() {
    this.status = "idle";
    this.wellnessPrograms = [];
    this.communityEvents = [];
    this.resources = [];
    this.participationMetrics = {};
  }

  initialize() {
    try {
      this.status = "initialized";
      this.loadWellnessData();
      console.log("[WellnessService] Wellness service initialized");
    } catch (error) {
      this.status = "error";
      console.error("[WellnessService] Initialization failed", error);
    }
  }

  loadWellnessData() {
    this.wellnessPrograms = [
      {
        id: 1,
        name: "Community Yoga",
        type: "physical",
        frequency: "3x weekly",
        participants: 34,
        description: "Morning yoga sessions in the community garden",
      },
      {
        id: 2,
        name: "Meditation Circle",
        type: "mental",
        frequency: "weekly",
        participants: 18,
        description: "Evening meditation for stress relief and mindfulness",
      },
      {
        id: 3,
        name: "Wellness Workshops",
        type: "educational",
        frequency: "bi-weekly",
        participants: 42,
        description: "Learn nutrition, herbalism, and holistic health",
      },
    ];

    this.communityEvents = [
      {
        id: 1,
        name: "Community Potluck",
        date: "2025-02-01",
        type: "social",
        participants: 0,
      },
      {
        id: 2,
        name: "Walking Trail Maintenance",
        date: "2025-02-08",
        type: "activity",
        participants: 0,
      },
      {
        id: 3,
        name: "Skill Sharing Fair",
        date: "2025-02-15",
        type: "educational",
        participants: 0,
      },
    ];

    this.resources = [
      {
        id: 1,
        name: "Mental Health Support",
        type: "counseling",
        available: true,
      },
      {
        id: 2,
        name: "Health Clinic",
        type: "medical",
        available: true,
      },
      {
        id: 3,
        name: "Nutrition Guidance",
        type: "dietary",
        available: true,
      },
    ];
  }

  getWellnessPrograms() {
    return this.wellnessPrograms;
  }

  getCommunityEvents() {
    return this.communityEvents;
  }

  getWellnessResources() {
    return this.resources;
  }

  registerForEvent(eventId, participantId) {
    try {
      const event = this.communityEvents.find((e) => e.id === eventId);
      if (event) {
        event.participants++;
      }
    } catch (error) {
      console.error("[WellnessService] Registration failed", error);
    }
  }

  getWellnessScore() {
    const totalParticipants = this.wellnessPrograms.reduce((sum, p) => sum + p.participants, 0);
    const communitySize = 250;
    const participationRate = (totalParticipants / (communitySize * 0.5)) * 100;
    return Math.min(Math.round(participationRate), 100);
  }

  getWellnessStats() {
    return {
      activePrograms: this.wellnessPrograms.length,
      totalParticipants: this.wellnessPrograms.reduce((sum, p) => sum + p.participants, 0),
      upcomingEvents: this.communityEvents.length,
      availableResources: this.resources.filter((r) => r.available).length,
      wellnessScore: this.getWellnessScore(),
    };
  }
}

const wellnessService = new WellnessService();
export default wellnessService;
