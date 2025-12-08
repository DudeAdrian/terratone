// src/services/CommunityNetworkService.js

class CommunityNetworkService {
  constructor() {
    this.status = "idle";
    this.communities = [];
    this.connections = [];
    this.collaborations = [];
  }

  initialize() {
    try {
      this.status = "initialized";
      this.loadMockCommunities();
      console.log("[CommunityNetworkService] Community network initialized");
    } catch (error) {
      this.status = "error";
      console.error("[CommunityNetworkService] Initialization failed", error);
    }
  }

  loadMockCommunities() {
    this.communities = [
      {
        id: "community-1",
        name: "Harmonic Valley",
        location: "Colorado, USA",
        population: 245,
        founded: "2021",
        sustainabilityScore: 87,
        focusAreas: ["renewable energy", "organic farming", "water conservation"],
        contact: "hello@harmonic-valley.org",
      },
      {
        id: "community-2",
        name: "Green Oasis",
        location: "Costa Rica",
        population: 180,
        founded: "2020",
        sustainabilityScore: 92,
        focusAreas: ["biodiversity", "regenerative agriculture", "education"],
        contact: "info@green-oasis.cr",
      },
      {
        id: "community-3",
        name: "Earth Commons",
        location: "Portugal",
        population: 320,
        founded: "2019",
        sustainabilityScore: 85,
        focusAreas: ["permaculture", "renewable energy", "arts & culture"],
        contact: "contact@earth-commons.org",
      },
    ];
  }

  getCommunities() {
    return this.communities;
  }

  searchCommunities(query) {
    return this.communities.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase()) ||
        c.focusAreas.some((area) => area.toLowerCase().includes(query.toLowerCase()))
    );
  }

  connectCommunities(fromId, toId, collaborationType) {
    try {
      const connection = {
        id: `conn-${Date.now()}`,
        from: fromId,
        to: toId,
        type: collaborationType,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      this.connections.push(connection);
      return connection;
    } catch (error) {
      console.error("[CommunityNetworkService] Connect failed", error);
    }
  }

  createCollaboration(title, communities, description) {
    try {
      const collaboration = {
        id: `collab-${Date.now()}`,
        title,
        communities,
        description,
        createdAt: new Date().toISOString(),
        status: "active",
      };
      this.collaborations.push(collaboration);
      return collaboration;
    } catch (error) {
      console.error("[CommunityNetworkService] Create collaboration failed", error);
    }
  }

  getCollaborations() {
    return this.collaborations;
  }

  getNetworkStats() {
    return {
      totalCommunities: this.communities.length,
      totalConnections: this.connections.length,
      totalCollaborations: this.collaborations.length,
      avgSustainabilityScore:
        this.communities.reduce((sum, c) => sum + c.sustainabilityScore, 0) / this.communities.length,
    };
  }
}

const communityNetworkService = new CommunityNetworkService();
export default communityNetworkService;
