// src/services/GovernanceService.js

import eventBus from "../core/EventBus";

class GovernanceService {
  constructor() {
    this.name = "Governance";
    this.status = "idle";
    this.proposals = [];
    this.votes = [];
    this.decisions = [];
    this.members = [];
    this.sofieCore = null;
    this.votingThreshold = 0.5; // 50% required to pass
    this.quorumRequired = 0.3; // 30% participation required
  }

  initialize(sofieCore) {
    try {
      this.sofieCore = sofieCore;
      this.status = "initialized";
      this.loadMembers();
      this.subscribeToEvents();
      console.log("[GovernanceService] Governance service initialized");
    } catch (error) {
      this.status = "error";
      console.error("[GovernanceService] Initialization failed", error);
    }
  }

  subscribeToEvents() {
    // Listen for community events that might trigger proposals
    eventBus.on("RESOURCE_DEPLETED", (data) => {
      this.createAutoProposal("Resource Alert", `${data.resource} is depleted. Propose action?`, "resource");
    });
  }

  loadMembers() {
    this.members = [
      { id: 1, name: "Alice Silva", role: "Community Coordinator", joinDate: "2021-01-15" },
      { id: 2, name: "Bob Martinez", role: "Resource Manager", joinDate: "2021-06-22" },
      { id: 3, name: "Carol Davis", role: "Sustainability Lead", joinDate: "2022-03-10" },
    ];
  }

  createProposal(title, description, type, options = ["approve", "reject"], creatorId = null) {
    try {
      const proposal = {
        id: `prop-${Date.now()}`,
        title,
        description,
        type, // resource, policy, technical, community, emergency
        options, // Array of voting options
        status: "active",
        createdAt: new Date().toISOString(),
        creatorId,
        votes: {}, // { optionIndex: count }
        voters: new Set(), // Track who voted
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        executionActions: [], // Actions to trigger if passed
      };

      // Initialize vote counts
      options.forEach((_, index) => {
        proposal.votes[index] = 0;
      });

      this.proposals.push(proposal);
      
      eventBus.emit("PROPOSAL_CREATED", { proposalId: proposal.id, title, type });
      
      return proposal;
    } catch (error) {
      console.error("[GovernanceService] Create proposal failed", error);
      return null;
    }
  }

  createAutoProposal(title, description, type) {
    // Automated proposal from system events
    return this.createProposal(title, description, type, ["approve", "reject"], "system");
  }

  addExecutionAction(proposalId, service, method, params) {
    // Add action to execute if proposal passes
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal) return false;

    proposal.executionActions.push({ service, method, params });
    return true;
  }

  getProposals(status = null) {
    if (status) {
      return this.proposals.filter((p) => p.status === status);
    }
    return this.proposals;
  }

  vote(proposalId, memberId, choiceIndex) {
    try {
      const proposal = this.proposals.find((p) => p.id === proposalId);
      if (!proposal) {
        console.error("Proposal not found");
        return { success: false, error: "Proposal not found" };
      }

      if (proposal.status !== "active") {
        return { success: false, error: "Proposal is not active" };
      }

      if (proposal.voters.has(memberId)) {
        return { success: false, error: "Already voted" };
      }

      if (choiceIndex < 0 || choiceIndex >= proposal.options.length) {
        return { success: false, error: "Invalid choice" };
      }

      // Record vote
      this.votes.push({
        id: `vote-${Date.now()}`,
        proposalId,
        memberId,
        choice: proposal.options[choiceIndex],
        choiceIndex,
        timestamp: new Date().toISOString(),
      });

      proposal.votes[choiceIndex]++;
      proposal.voters.add(memberId);

      eventBus.emit("VOTE_CAST", { proposalId, memberId, choice: proposal.options[choiceIndex] });

      // Auto-close if quorum reached and deadline passed
      this.checkProposalStatus(proposalId);

      return { success: true, proposal };
    } catch (error) {
      console.error("[GovernanceService] Vote failed", error);
      return { success: false, error: error.message };
    }
  }

  checkProposalStatus(proposalId) {
    const proposal = this.proposals.find((p) => p.id === proposalId);
    if (!proposal || proposal.status !== "active") return;

    const now = new Date();
    const expiryDate = new Date(proposal.expiresAt);
    const totalMembers = this.members.length;
    const totalVotes = proposal.voters.size;
    const participation = totalVotes / totalMembers;

    // Check if expired
    if (now > expiryDate) {
      this.closeProposal(proposalId);
    }

    // Check if quorum reached and majority clear
    if (participation >= this.quorumRequired) {
      const maxVotes = Math.max(...Object.values(proposal.votes));
      const winningChoice = Object.keys(proposal.votes).find(
        (key) => proposal.votes[key] === maxVotes
      );
      
      // If winning choice has >50% of votes, can close early
      if (proposal.votes[winningChoice] / totalVotes > this.votingThreshold) {
        this.closeProposal(proposalId);
      }
    }
  }

  closeProposal(proposalId) {
    try {
      const proposal = this.proposals.find((p) => p.id === proposalId);
      if (!proposal || proposal.status !== "active") return;

      proposal.status = "closed";

      const totalVotes = proposal.voters.size;
      const participation = totalVotes / this.members.length;
      const quorumMet = participation >= this.quorumRequired;

      // Determine winning option
      const maxVotes = Math.max(...Object.values(proposal.votes));
      const winningIndex = Object.keys(proposal.votes).find(
        (key) => proposal.votes[key] === maxVotes
      );
      const winningOption = proposal.options[winningIndex];
      const passed = quorumMet && (winningOption === "approve" || winningOption === proposal.options[0]);

      const decision = {
        id: `decision-${Date.now()}`,
        proposalId,
        passed,
        quorumMet,
        participation: Math.round(participation * 100),
        winningOption,
        finalVotes: { ...proposal.votes },
        timestamp: new Date().toISOString(),
      };

      this.decisions.push(decision);

      // Execute actions if passed
      if (passed && quorumMet) {
        this.executeProposal(proposal);
      }

      eventBus.emit("PROPOSAL_CLOSED", { proposalId, passed, decision });

      return decision;
    } catch (error) {
      console.error("[GovernanceService] Close proposal failed", error);
      return null;
    }
  }

  executeProposal(proposal) {
    if (!this.sofieCore) {
      console.error("Cannot execute proposal: sofieCore not available");
      return;
    }

    console.log(`[GovernanceService] Executing proposal: ${proposal.title}`);

    proposal.executionActions.forEach((action) => {
      try {
        const service = this.sofieCore.services[action.service];
        if (service && typeof service[action.method] === "function") {
          service[action.method](...action.params);
          console.log(`Executed: ${action.service}.${action.method}`);
        } else {
          console.error(`Service method not found: ${action.service}.${action.method}`);
        }
      } catch (error) {
        console.error(`Execution failed for ${action.service}.${action.method}:`, error);
      }
    });

    eventBus.emit("PROPOSAL_EXECUTED", { proposalId: proposal.id, title: proposal.title });
  }

  getMembers() {
    return this.members;
  }

  getDecisions() {
    return this.decisions;
  }

  getGovernanceStats() {
    return {
      totalMembers: this.members.length,
      totalProposals: this.proposals.length,
      activeProposals: this.proposals.filter((p) => p.status === "active").length,
      totalDecisions: this.decisions.length,
      passedProposals: this.decisions.filter((d) => d.passed).length,
    };
  }
}

const governanceService = new GovernanceService();
export default governanceService;
