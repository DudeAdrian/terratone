# API Endpoint Specification - Phase 2d 📋

**Document Date:** December 11, 2025  
**API Version:** 1.0  
**Frontend Status:** ✅ Ready for Backend Implementation  
**Total Endpoints:** 43 new + 25 existing = 68 total

---

## Library & Global Network APIs (13 endpoints)

### Herbal Library
```
GET /api/herbal-library?regionId={regionId}
  Description: Get all herbal remedies for a region
  Query Params: regionId (optional), limit, offset
  Response: { remedies: [...], totalRemedies: number, totalSpecies: number }
  
GET /api/herbal-library/{id}
  Description: Get specific herbal remedy details
  Path Params: id
  Response: { id, name, description, uses: [...], ingredients: [...], preparation: string }

POST /api/herbal-library
  Description: Add new herbal remedy (admin only)
  Body: { name, description, uses, ingredients, preparation }
  Response: { id, ...created_data }
```

### Seed Bank
```
GET /api/seed-bank?regionId={regionId}
  Description: Get all seed varieties in inventory
  Query Params: regionId (optional), type, endangered, limit, offset
  Response: { varieties: [...], totalSeeds: number, endangered: number }

GET /api/seed-bank/{id}
  Description: Get specific seed variety details
  Path Params: id
  Response: { id, name, species, quantity, endangered, germination_rate, storage_temp }

GET /api/seed-bank/items?regionId={regionId}
  Description: Get seed bank items (alias for variety listing)
  Response: { items: [...], total: number }

POST /api/seed-bank/{id}/checkout
  Description: Check out seeds from inventory
  Body: { quantity, purpose, returnable }
  Response: { checkoutId, quantity, expiresAt }
```

### Knowledge Base
```
GET /api/knowledge-base?regionId={regionId}
  Description: Get all knowledge base articles
  Query Params: regionId (optional), category, limit, offset
  Response: { articles: [...], totalArticles: number, categories: [...] }

GET /api/knowledge-base/{id}
  Description: Get specific article
  Path Params: id
  Response: { id, title, content, category, author, createdAt, views, rating }

GET /api/knowledge-base/articles?category={category}
  Description: Get articles by category
  Query Params: category (optional)
  Response: { articles: [...], category, total: number }

POST /api/knowledge-base
  Description: Create new article
  Body: { title, content, category, tags }
  Response: { id, ...created_data }
```

### Aquaponic Library
```
GET /api/aquatic-life?regionId={regionId}
  Description: Get aquatic species information
  Query Params: regionId (optional), type, limit
  Response: { species: [...], totalSpecies: number }

GET /api/aquatic-life/species?regionId={regionId}
  Description: Get detailed species catalog
  Query Params: regionId, compatibility
  Response: { species: [...], compatibilityMatrix: {...} }

GET /api/aquatic-life/{id}
  Description: Get specific species details
  Response: { id, commonName, scientificName, temperature, pH, bioload, compatibility: [...] }
```

### Global Network
```
GET /api/global/communities?regionId={regionId}
  Description: Get all communities in network
  Query Params: regionId (optional), status, tier, limit, offset
  Response: { communities: [...], totalCommunities: 156, totalPopulation: 28450 }

GET /api/global/metrics
  Description: Get global network statistics
  Response: { totalCommunities: 156, totalPopulation: 28450, avgSelfSufficiency: 76,
              energyExchanged: 1250, foodExchanged: 8900, waterShared: 45000 }

GET /api/global/trades?limit={limit}
  Description: Get recent inter-community trades
  Query Params: limit (default 50), offset, status
  Response: { trades: [...], total: number, timestamp }

GET /api/global/libraries
  Description: Get aggregated library statistics
  Response: { herbal: {...}, seedBank: {...}, knowledge: {...}, aquaponic: {...} }

GET /api/global/resources
  Description: Get global resource distribution map
  Response: { regions: {...}, heatmap: {...}, critical_areas: [...] }
```

---

## Governance APIs (7 endpoints)

```
GET /api/governance/stats
  Description: Get governance system statistics
  Response: { totalMembers: number, totalProposals: number, activeProposals: number,
              passedProposals: number, avgVoterTurnout: number }

GET /api/governance/proposals?status={status}
  Description: List all proposals with optional status filter
  Query Params: status (active/passed/rejected/draft), limit, offset
  Response: { proposals: [{
    id, title, description, status, proposer, createdAt, votesFor, votesAgainst,
    votesAbstain, deadline, execution_address, execution_data
  }], total: number }

GET /api/governance/proposals/{id}
  Description: Get detailed proposal with voting breakdown
  Path Params: id
  Response: { id, title, description, status, proposer, createdAt, votes: {
    for: [...], against: [...], abstain: [...], delegates: [...]
  }, timeline: [...] }

POST /api/governance/proposals
  Description: Create new proposal (members only)
  Body: { title, description, execution_address, execution_data }
  Response: { id, ...created_data, createdAt, deadline }

POST /api/governance/proposals/{id}/votes
  Description: Submit vote on proposal
  Path Params: id
  Body: { voter_address, vote (for/against/abstain), reason }
  Response: { voteId, recorded, votingPower, timestamp, delegated_from }

GET /api/governance/members?regionId={regionId}
  Description: List governance members
  Query Params: regionId (optional), role, active_only
  Response: { members: [{
    id, address, name, role, region, joined_at, voting_power, delegated_power,
    proposals_created, votes_cast, active
  }], total: number }

GET /api/governance/delegates
  Description: Get delegation information
  Response: { delegates: [{
    id, name, address, delegators_count, total_delegated_power, specialization
  }], voting_power_by_region: {...} }
```

---

## Expansion APIs (7 endpoints)

```
GET /api/expansion/projects?status={status}
  Description: List all expansion projects
  Query Params: status (planning/approved/in-progress/completed), type, limit
  Response: { projects: [{
    id, name, description, type (housing/water/solar), status, location, region,
    startDate, targetDate, progress, budget, spent, manager
  }], total: number, aggregatedProgress: number }

GET /api/expansion/metrics
  Description: Get expansion program statistics
  Response: { totalProjects: number, inProgress: number, completed: number,
              budgetTotal: number, budgetSpent: number, workforce: number,
              timeline_adherence: number }

GET /api/expansion/housing?regionId={regionId}
  Description: Get housing expansion details
  Query Params: regionId (optional), status
  Response: { projects: [{
    id, name, units_planned, units_completed, location, construction_stage,
    capacity_increase, start_date, target_date, team_size
  }], total_new_capacity: number }

GET /api/expansion/water?regionId={regionId}
  Description: Get water system expansion details
  Query Params: regionId (optional)
  Response: { projects: [{
    id, name, system_type, capacity_liters, treatment_method, coverage_area,
    population_served, redundancy_level, status
  }], total_capacity: number, coverage_improvement: number }

GET /api/expansion/solar?regionId={regionId}
  Description: Get solar energy expansion details
  Query Params: regionId (optional)
  Response: { projects: [{
    id, name, capacity_kw, panel_count, efficiency_rating, installation_date,
    grid_connection, status, estimated_output_kwh
  }], total_capacity_kw: number, regions_covered: number }

GET /api/expansion/timeline
  Description: Get expansion program timeline
  Response: { milestones: [{
    date, name, associated_projects: [...], completion_percentage, status
  }], critical_path: [...], projected_completion: date }
```

---

## Resilience APIs (6 endpoints)

```
GET /api/resilience/metrics?regionId={regionId}
  Description: Get resilience metrics for region
  Query Params: regionId (optional)
  Response: { resilienceScore: number (0-100), metrics: {
    emergency_preparedness: number, resource_diversity: number, backup_capacity: number,
    response_time: number_seconds, recovery_time: number_days
  }, trends: [...], recommendations: [...] }

GET /api/resilience/emergency-plans
  Description: List all emergency plans
  Response: { plans: [{
    id, name, description, scope, activation_criteria, responsible_agency,
    last_review: date, next_review: date, status (active/review/archived)
  }], total: number, active_count: number }

GET /api/resilience/preparedness?regionId={regionId}
  Description: Get emergency preparedness status
  Query Params: regionId (optional)
  Response: { preparedness_level: number (1-5), drills_completed: number,
              staff_trained: number, supplies_stockpiled: {...},
              evacuation_routes: number, shelters_capacity: number }

GET /api/resilience/risks?regionId={regionId}
  Description: List current and projected risks
  Query Params: regionId (optional)
  Response: { risks: [{
    id, type (natural/technical/social), description, severity (1-5),
    probability (0-1), potential_impact, mitigation_strategy, status
  }], high_risk_count: number, risk_matrix: {...} }

GET /api/resilience/resources?type={type}
  Description: Get backup/emergency resources
  Query Params: type (water/food/medical/energy), status
  Response: { resources: [{
    id, type, quantity, condition, location, access_time_minutes, responsible_party
  }], total_by_type: {...}, critical_gaps: [...] }

GET /api/resilience/backups?regionId={regionId}
  Description: Get backup system status
  Query Params: regionId (optional)
  Response: { systems: [{
    id, name, type (power/water/communication), primary_capacity, backup_capacity,
    switchover_time_seconds, last_test: date, status (operational/degraded/failed)
  }], redundancy_level: number, critical_systems_protected: number }
```

---

## Alert Management APIs (3 endpoints)

```
GET /api/alerts?status={status}
  Description: Get alerts with optional status filter
  Query Params: status (active/acknowledged/resolved), severity, limit, offset
  Response: { alerts: [{
    id, severity (critical/warning/info), message, source_system, created_at,
    acknowledged_at, resolved_at, assigned_to, metadata: {...}
  }], active_count: number, critical_count: number }

PUT /api/alerts/{id}
  Description: Acknowledge alert
  Path Params: id
  Body: { acknowledged: true, acknowledging_user: string, note: string (optional) }
  Response: { id, acknowledged_at, status: acknowledged }

POST /api/alerts/{id}/resolve
  Description: Resolve alert with action taken
  Path Params: id
  Body: { resolution: string, action_taken: string, verified: boolean }
  Response: { id, status: resolved, resolved_at, resolution_record: {...} }
```

---

## Response Status Codes

All endpoints should return:
- **200** - Successful GET/PUT
- **201** - Successful POST/creation
- **204** - Successful DELETE
- **400** - Bad request (invalid params)
- **401** - Unauthorized (auth required)
- **403** - Forbidden (permission denied)
- **404** - Not found
- **500** - Server error
- **503** - Service unavailable

Standard error response:
```json
{
  "error": "error_code",
  "message": "Human readable message",
  "timestamp": "2025-12-11T15:30:00Z",
  "request_id": "uuid"
}
```

---

## Common Query Parameters

All list endpoints should support:
- `limit` (default: 20, max: 100) - Items per page
- `offset` (default: 0) - Pagination offset
- `regionId` (optional) - Filter by region
- `status` (optional) - Filter by status
- `sort` (optional) - Sort field
- `order` (optional) - asc/desc

Example:
```
GET /api/governance/proposals?status=active&limit=50&offset=0&sort=createdAt&order=desc
```

---

## Authentication & Authorization

**Headers Required:**
```
Authorization: Bearer {token}
X-User-Address: {wallet_address}  (for Web3)
Content-Type: application/json
```

**Permission Levels:**
- `public` - No auth required (GET public data)
- `member` - Community member (vote, submit proposals)
- `delegate` - Governance delegate (execute proposals)
- `admin` - System admin (manage users, modify systems)

---

## Rate Limiting

Recommended:
- **Public endpoints:** 100 requests/minute/IP
- **Member endpoints:** 1000 requests/minute/user
- **Admin endpoints:** No limit

---

## Testing Checklist for Backend Team

- [ ] All 43 endpoints implemented
- [ ] All query parameters supported
- [ ] All response formats match specification
- [ ] Error handling returns proper status codes
- [ ] Authentication works correctly
- [ ] Regional filtering works
- [ ] Pagination works (limit/offset)
- [ ] Sorting works on listable fields
- [ ] Load testing at 1000 requests/second
- [ ] Database indexes for performance
- [ ] Caching strategy for GET endpoints
- [ ] WebSocket support for real-time updates (optional)

---

## Integration Path

1. **Week 1:** Implement governance endpoints (7)
2. **Week 2:** Implement expansion endpoints (7)
3. **Week 3:** Implement resilience endpoints (6)
4. **Week 4:** Implement alert endpoints (3) + testing

**Parallel:** Frontend team continues page integrations

---

## Contact & Questions

**Frontend Lead:** (Integration Owner)  
**API Docs:** This specification  
**Test Status:** Endpoints defined, frontend ready  
**Backend Progress Tracking:** To be determined

---

**Ready for backend team implementation! 🚀**
