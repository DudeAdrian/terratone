/**
 * Heartware Controller
 * Business logic for community management, resource sharing, governance
 */

const db = require('../database/connection');

class HeartwareController {
  static async getCommunity(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      const community = await db.getInstance().community.findFirst({
        where: { regionId }
      });
      
      res.json(community || {
        name: 'Default Community',
        members: 1,
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCommunity(req, res) {
    try {
      const { regionId = 'default', name, description } = req.body;
      
      const community = await db.getInstance().community.create({
        data: {
          regionId,
          name,
          description,
          members: 1,
          status: 'active',
          founded: new Date()
        }
      });
      
      res.status(201).json(community);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateCommunity(req, res) {
    try {
      const { id } = req.params;
      
      const community = await db.getInstance().community.update({
        where: { id },
        data: { ...req.body, updatedAt: new Date() }
      });
      
      res.json(community);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMembers(req, res) {
    try {
      const { regionId = 'default', communityId } = req.query;
      
      const members = await db.getInstance().communityMember.findMany({
        where: { regionId, ...(communityId && { communityId }) }
      });
      
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addMember(req, res) {
    try {
      const { regionId = 'default', communityId, userId, role = 'member' } = req.body;
      
      const member = await db.getInstance().communityMember.create({
        data: {
          regionId,
          communityId,
          userId,
          role,
          joinedAt: new Date()
        }
      });
      
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMember(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      const member = await db.getInstance().communityMember.update({
        where: { id },
        data: { role }
      });
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeMember(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().communityMember.delete({ where: { id } });
      res.json({ message: 'Member removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSharedResources(req, res) {
    try {
      const { regionId = 'default', type } = req.query;
      
      const resources = await db.getInstance().sharedResource.findMany({
        where: { regionId, ...(type && { type }) }
      });
      
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addResource(req, res) {
    try {
      const { regionId = 'default', type, name, description, available, borrowable, owner } = req.body;
      
      const resource = await db.getInstance().sharedResource.create({
        data: {
          regionId,
          type,
          name,
          description,
          available,
          borrowable,
          owner
        }
      });
      
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateResource(req, res) {
    try {
      const { id } = req.params;
      
      const resource = await db.getInstance().sharedResource.update({
        where: { id },
        data: { ...req.body, updatedAt: new Date() }
      });
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async removeResource(req, res) {
    try {
      const { id } = req.params;
      
      await db.getInstance().sharedResource.delete({ where: { id } });
      res.json({ message: 'Resource removed' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async borrowResource(req, res) {
    try {
      const { id } = req.params;
      const { userId, returnDate } = req.body;
      
      res.json({
        message: 'Resource borrowed',
        resourceId: id,
        userId,
        returnDate,
        status: 'active'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async returnResource(req, res) {
    try {
      const { id } = req.params;
      const { condition } = req.body;
      
      res.json({
        message: 'Resource returned',
        resourceId: id,
        condition,
        status: 'completed'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProposals(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      res.json({
        proposals: [
          {
            id: 'prop-001',
            title: 'Expand garden area',
            description: 'Add 500 sqm for additional crops',
            status: 'voting',
            votes: { yes: 3, no: 1 }
          }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProposal(req, res) {
    try {
      const { regionId = 'default', title, description } = req.body;
      
      res.status(201).json({
        id: `prop-${Date.now()}`,
        title,
        description,
        status: 'voting',
        votes: { yes: 0, no: 0 }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async voteOnProposal(req, res) {
    try {
      const { proposalId, userId, vote } = req.body;
      
      res.json({
        message: 'Vote recorded',
        proposalId,
        userId,
        vote
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getVotes(req, res) {
    try {
      const { proposalId } = req.params;
      
      res.json({
        proposalId,
        votes: [
          { userId: 'user-001', vote: 'yes' },
          { userId: 'user-002', vote: 'no' }
        ]
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getEvents(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      res.json([
        {
          id: 'event-001',
          name: 'Community Garden Day',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          attendees: 5
        }
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createEvent(req, res) {
    try {
      const { regionId = 'default', name, date, description } = req.body;
      
      res.status(201).json({
        id: `event-${Date.now()}`,
        name,
        date,
        description,
        attendees: 1
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateEvent(req, res) {
    try {
      const { id } = req.params;
      
      res.json({
        message: 'Event updated',
        eventId: id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async attendEvent(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      res.json({
        message: 'Attendance recorded',
        eventId: id,
        userId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async cancelEvent(req, res) {
    try {
      const { id } = req.params;
      
      res.json({
        message: 'Event cancelled',
        eventId: id
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getSkills(req, res) {
    try {
      const { regionId = 'default' } = req.query;
      
      res.json([
        { skillId: 'skill-001', name: 'Carpentry', provider: 'user-001' },
        { skillId: 'skill-002', name: 'Gardening', provider: 'user-002' }
      ]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async offerSkill(req, res) {
    try {
      const { regionId = 'default', userId, skill, proficiency } = req.body;
      
      res.status(201).json({
        skillId: `skill-${Date.now()}`,
        userId,
        skill,
        proficiency
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async requestSkill(req, res) {
    try {
      const { id } = req.params;
      const { requesterId } = req.body;
      
      res.json({
        message: 'Skill request submitted',
        skillId: id,
        requesterId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = HeartwareController;
