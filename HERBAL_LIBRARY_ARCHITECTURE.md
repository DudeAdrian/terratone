# Herbal Library System Architecture
## Independent Dual Implementation

Two independent, complementary herbal library systems designed for different purposes and audiences.

---

## 1. SOFIE SYSTEMS HERBAL LIBRARY (Community Edition)
**Location:** `sofie-systems-ui` (Community Sustainability Platform)  
**Type:** Standalone, Offline-first Knowledge Base  
**Purpose:** Community education, resilience, cultural preservation

### Architecture
```
sofie-systems-ui/
├── src/
│   ├── services/
│   │   └── HerbalLibraryService.js      # In-memory service, local storage
│   ├── pages/
│   │   └── HerbalLibrary.js             # Community-facing UI
│   ├── core/
│   │   └── SofieCore.js                 # Service registration
│   └── App.js                           # /herbal-library route
```

### Features
- **Search & Filter:** By tradition, community use, pregnancy safety
- **11 Herbs from 7 Traditions:**
  - Ayurveda: Ashwagandha, Tulsi, Turmeric
  - TCM: Ginseng, Reishi
  - Native American: Sage, Echinacea, Cedar
  - African: African Ginger, Buchu
  - Amazonian: Cat's Claw, Copaiba
  - Aboriginal: Tea Tree, Kakadu Plum
  - European: Chamomile, Lavender, St. John's Wort
- **Data Fields (per herb, 25+):**
  - Cultural origin & lore
  - Therapeutic uses (6-8 conditions each)
  - Energetics & chakra alignment
  - Preparation methods & dosage
  - Safety: pregnancy, nursing, children, contraindications
  - Sustainability & ethical sourcing
  - Active constituents & research notes
- **Access:** No login required, accessible offline
- **Storage:** LocalStorage + in-memory caching
- **Integration:** Registered with SofieCore as "herbalLibrary" service

### Services Hub Integration
```
Services Page → [Herbal Library Card] → /herbal-library
  ├── Grid view of all herbs
  ├── Filter sidebar
  └── Detail modal with full information
```

### Usage
```javascript
// Any page can access
const herbalService = sofieCore.getService("herbalLibrary");
const herbs = herbalService.getHerbs({ tradition: "Ayurveda", pregnancySafe: true });
```

### Expansion Path
- ✅ 11 foundational herbs (complete)
- 📋 Expand to 50+ herbs (by tradition, region)
- 📋 Add community contributions form
- 📋 Export to PDF/sharing
- 📋 Multi-language support
- 📋 Video preparation tutorials
- 📋 Integration with Seed Bank (herb growing guide)

---

## 2. HEARTWARE HERBAL SYSTEM (Personal Health Edition)
**Location:** `heartware-ui` (Personal Health Platform)  
**Type:** User-centric, Database-backed Health Tracking  
**Purpose:** Personal wellness journal, AI-integrated guidance, health records

### Architecture
```
heartware-ui/
├── src/
│   ├── services/
│   │   ├── AICompanionService.js        # AI integration + herbal consultation
│   │   └── HerbalLibraryService.js      # Display reference herbs
│   ├── pages/
│   │   ├── HerbalLibrary.js             # Community knowledge reference
│   │   ├── PersonalHerbalJournal.js     # Private tracking/journal
│   │   ├── AIChat.js                    # AI companion (herbal guidance)
│   │   └── Wellness.js                  # Health hub (links to journal)
│   ├── App.js                           # Routes
│   └── theme/                           # GlassmorphismTheme (UI components)

sofie-backend/
├── prisma/
│   ├── schema.prisma                    # 3 herbal models (Herb, HerbalJournalEntry, HerbalRemedy)
│   └── herbal-seed.js                   # 20+ herbs with full data
├── src/
│   ├── routes/
│   │   └── herbal.js                    # 10+ API endpoints
│   └── index.js                         # Integrated routes
```

### Personal Herbal Journal Features
- **CRUD Operations:**
  - Record herb used, preparation, dosage
  - Date used, purpose, effects
  - Effectiveness rating (1-10)
  - Side effects & contraindications
  - Personal notes & reflection
- **Tracking:**
  - Effectiveness trends over time
  - Frequency of use
  - "Would use again" indicator
  - Unique herb count
  - Average effectiveness stats
- **Integration:**
  - Logs entries with AI Companion for context
  - Privacy-first (localStorage + future API)
  - User-specific data (future auth)
- **UI:**
  - Dark mode, glassmorphic design
  - Entry form with rich fields
  - Historical journal view
  - Effectiveness color-coding
  - Delete capability

### AI Companion Integration
```javascript
// In AIChat.js
const handleHerbalConsultation = async () => {
  const recommendations = await aiCompanion.getHerbalConsultation(condition);
  // Display: herb suggestions with cultural wisdom + safety notes
};

// Future: AI suggests herbs based on:
// - User's health profile
// - Condition description
// - Previous journal entries
// - Cultural traditions
```

### API Endpoints (sofie-backend)
```
GET  /api/herbs                          # Search & filter
GET  /api/herbs/:id                      # Detail view
GET  /api/herbs/meta/traditions          # Available traditions
GET  /api/herbs/meta/conditions          # Therapeutic uses

GET  /api/herbal-journal/:userId         # User's entries
POST /api/herbal-journal                 # Create entry
PUT  /api/herbal-journal/:id             # Update entry

GET  /api/remedies                       # Traditional formulas
GET  /api/remedies/:id                   # Formula details

POST /api/ai/herbal-consultation         # AI recommendations
```

### Data Models (Prisma)
```prisma
model Herb {
  id, commonName, scientificName, indigenousNames[]
  traditions[], culturalOrigin[], sacredUses, lore
  therapeuticUses[], energeticProperties, chakraAlignment[]
  elementalAssociation, tastProfile[], thermalNature
  bodySystemsAffected[], organAffinity[]
  partsUsed[], preparationMethods[], dosageGuidelines
  contraindications[], medicationInteractions[]
  pregnancySafe, nursingMotherSafe, childrenSafe
  nativeRegions[], sustainabilityStatus, ethicalHarvesting
  activeConstituents[], researchNotes, references[]
  userJournalEntries[], remedies[]
}

model HerbalJournalEntry {
  id, userId, herbId, dateUsed, preparationUsed, dosage
  purposeOfUse, immediateEffects, longerTermEffects
  effectiveness (1-10), sideEffects, personalNotes
  wouldUseAgain, herb[], createdAt, updatedAt
}

model HerbalRemedy {
  id, name, tradition, purpose
  herbsUsed[], ingredients[], preparationSteps[]
  dosageInstructions, frequency, duration
  bestTimeToTake, seasonalUse, energeticAction, source
}
```

### Expansion Path
- ✅ PersonalHerbalJournal component (complete)
- ✅ AIChat + herbal consultation methods (complete)
- 📋 Backend migration & seed (blocked on DATABASE_URL)
- 📋 API integration (journal CRUD)
- 📋 Herbal recommendations based on health profile
- 📋 Medication interaction warnings
- 📋 Sharing with healthcare providers (consent)
- 📋 Blockchain record of herb usage (for research)
- 📋 Multi-user families (shared wellness)
- 📋 Integration with wearables (sleep, stress, heart rate)

---

## 3. INDEPENDENCE & SYNC PATTERNS

### Why Independent?
1. **Different Use Cases:** Community learning ≠ Personal health tracking
2. **Different Data Models:** Public herb DB ≠ Private user journal
3. **Different Access Patterns:** Offline-first ≠ Auth-required + backend
4. **Different Deployment:** Sofie-Systems standalone ≠ Heartware + backend
5. **Different Audiences:** Communities ≠ Individual patients + AI

### Architecture Diagram
```
┌─────────────────────────────────────┐
│      SOFIE SYSTEMS UI (Community)   │
├─────────────────────────────────────┤
│  HerbalLibraryService (in-memory)   │
│         ↓                            │
│  HerbalLibrary.js Page (UI)          │
│     (Search, Filter, Details)        │
│  • No login                          │
│  • Offline work                      │
│  • 11 reference herbs                │
│  • /herbal-library route             │
└─────────────────────────────────────┘
         ✗ No coupling
         ✓ Can sync future
                ↓
┌─────────────────────────────────────┐
│    HEARTWARE UI (Personal Health)    │
├─────────────────────────────────────┤
│  HerbalLibrary.js (Reference Copy)   │ ← Mirrors community knowledge
│  PersonalHerbalJournal.js (Journal)  │ ← Private user tracking
│  AIChat.js (Companion)               │ ← Wisdom + recommendations
│     ↓                                 │
│  AICompanionService                  │
│     ↓                                 │
│  /api/herbal-* endpoints             │
│     ↓                                 │
├─────────────────────────────────────┤
│    SOFIE-BACKEND API (Optional)     │
├─────────────────────────────────────┤
│  Prisma: Herb, HerbalJournalEntry   │
│  PostgreSQL Database                │
│  • User journal entries              │
│  • Herbal recommendations            │
│  • Research tracking                 │
│  • Blockchain audit log              │
└─────────────────────────────────────┘
```

### Future Sync Strategy (Optional)
```javascript
// If Heartware wants to contribute to community knowledge:
POST /api/herbal/contribute
  - User submits herbal journal entry
  - Anonymized (remove user ID, personal notes)
  - Added to community database
  - Increases "Community Data Points" stat

// Sofie-Systems pulls aggregated data:
GET /api/herbal/community-stats
  - Aggregated effectiveness ratings
  - Most-used herbs by region
  - Emerging traditions/practices
  - Research insights
```

---

## 4. IMPLEMENTATION CHECKLIST

### ✅ COMPLETED
- [x] Sofie-Systems HerbalLibraryService (11 herbs, 7 traditions)
- [x] Sofie-Systems HerbalLibrary.js UI (search, filter, detail)
- [x] Sofie-Systems Services Hub integration
- [x] Heartware HerbalLibrary.js (community reference)
- [x] Heartware PersonalHerbalJournal.js (full CRUD)
- [x] Heartware AIChat integration (herbal consultation)
- [x] Heartware AICompanionService enhancements
- [x] Heartware App.js routing
- [x] Heartware Wellness page (herbal journal link)
- [x] Backend Prisma schema (3 models)
- [x] Backend herbal.js API routes (10+ endpoints)
- [x] Backend herbal-seed.js (20+ herbs)

### ⏳ PENDING
- [ ] **Backend Setup:**
  - [ ] Set DATABASE_URL env var
  - [ ] `npx prisma migrate dev --name add_herbal_medicine`
  - [ ] `node prisma/herbal-seed.js`
- [ ] **Heartware Integration:**
  - [ ] Wire PersonalHerbalJournal to API
  - [ ] User authentication
  - [ ] Health profile integration
- [ ] **Testing:**
  - [ ] Sofie-Systems herb display test
  - [ ] Heartware journal CRUD test
  - [ ] AI companion recommendations test
- [ ] **Git:**
  - [ ] Commit sofie-systems-ui herbal updates
  - [ ] Commit heartware-ui herbal updates
  - [ ] Commit sofie-backend herbal system
  - [ ] Push to GitHub

### 📋 FUTURE ENHANCEMENTS
- Herb images & videos
- Community contributions
- Multi-language support
- Export to PDF
- Wearable integration
- Predictive recommendations
- Research publication links
- Blockchain audit trail
- Integration with clinical data

---

## 5. QUICK START

### Sofie-Systems (Already Live)
```bash
cd sofie-systems-ui
npm start
# Visit http://localhost:3000/services → Herbal Library
# OR http://localhost:3000/herbal-library
```

### Heartware (Partial - Awaiting Backend)
```bash
# Frontend only (works without backend)
cd heartware-ui
npm start
# Visit http://localhost:3000/herbal-library (reference)
# Visit http://localhost:3000/herbal-journal (journal, uses localStorage)
# Visit http://localhost:3000/ai-companion (AI herbal guidance)

# Backend setup (when ready)
cd sofie-backend
$env:DATABASE_URL="postgresql://user:pass@localhost/sofie_db"
npx prisma migrate dev --name add_herbal_medicine
node prisma/herbal-seed.js
npm run dev
```

---

## 6. FILE MANIFEST

### Sofie-Systems (Community)
- `src/services/HerbalLibraryService.js` — Core service
- `src/pages/HerbalLibrary.js` — UI page
- `src/core/SofieCore.js` — Service registration
- `src/pages/Services.js` — Hub card integration

### Heartware (Personal)
- `src/services/AICompanionService.js` — Herbal consultation methods
- `src/pages/HerbalLibrary.js` — Community reference (copy)
- `src/pages/PersonalHerbalJournal.js` — Private journal CRUD
- `src/pages/AIChat.js` — AI companion + herbal modal
- `src/pages/Wellness.js` — Hub with journal link
- `src/App.js` — Routes

### Backend (Optional, for Heartware)
- `prisma/schema.prisma` — 3 herbal models
- `src/routes/herbal.js` — 10+ API endpoints
- `prisma/herbal-seed.js` — 20+ herb data
- `src/index.js` — Route registration

---

## Philosophy

**Two systems, one knowledge.**

Sofie-Systems preserves and shares indigenous herbal wisdom as a **community asset**—freely available, offline-ready, culturally respectful.

Heartware personalizes that wisdom for **individual healing journeys**—integrated with modern health tracking, AI guidance, and personal reflection.

Neither requires the other. Both thrive independently. Together, they honor ancient knowledge while supporting modern wellness.

🌿 **Herbal wisdom for communities and individuals.**
