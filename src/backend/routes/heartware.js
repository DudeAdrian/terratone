/**
 * Heartware Domain Routes
 * Endpoints for community building, resource sharing, and governance
 */

const express = require('express');
const router = express.Router();
const HeartwareController = require('../controllers/HeartwareController');

// Community Management
router.get('/community', HeartwareController.getCommunity);
router.post('/community', HeartwareController.createCommunity);
router.patch('/community/:id', HeartwareController.updateCommunity);
router.get('/community/members', HeartwareController.getMembers);
router.post('/community/members', HeartwareController.addMember);
router.patch('/community/members/:id', HeartwareController.updateMember);
router.delete('/community/members/:id', HeartwareController.removeMember);

// Resource Sharing
router.get('/resources', HeartwareController.getSharedResources);
router.post('/resources', HeartwareController.addResource);
router.patch('/resources/:id', HeartwareController.updateResource);
router.delete('/resources/:id', HeartwareController.removeResource);
router.post('/resources/:id/borrow', HeartwareController.borrowResource);
router.post('/resources/:id/return', HeartwareController.returnResource);

// Governance & Voting
router.get('/governance/proposals', HeartwareController.getProposals);
router.post('/governance/proposals', HeartwareController.createProposal);
router.post('/governance/vote', HeartwareController.voteOnProposal);
router.get('/governance/votes/:proposalId', HeartwareController.getVotes);

// Community Events
router.get('/events', HeartwareController.getEvents);
router.post('/events', HeartwareController.createEvent);
router.patch('/events/:id', HeartwareController.updateEvent);
router.post('/events/:id/attend', HeartwareController.attendEvent);
router.delete('/events/:id', HeartwareController.cancelEvent);

// Skills & Knowledge Exchange
router.get('/skills', HeartwareController.getSkills);
router.post('/skills', HeartwareController.offerSkill);
router.post('/skills/:id/request', HeartwareController.requestSkill);

module.exports = router;
