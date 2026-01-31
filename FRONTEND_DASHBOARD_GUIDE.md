# SOFIE Community Dashboard - Frontend Integration Guide

## 🎯 Next Phase: Build React Components

The backend API is now ready. Next, create React components to display and interact with community data.

---

## 📱 Component Architecture

### 1. **CommunityDashboard.js** (Main View)
**Location:** `src/pages/CommunityDashboard.js`

**Props:**
```javascript
const [communitySlug, setCommunitySlug] = useState('fiji-nadi'); // From URL param
const [community, setCommunity] = useState(null);
const [metrics, setMetrics] = useState([]);
const [alerts, setAlerts] = useState([]);
```

**Render:**
```
┌─────────────────────────────────────────────────┐
│  Community Header (Name, Population, Manager)   │
├─────────────────────────────────────────────────┤
│  6 Metric Cards (Health, Energy, Food, Water)   │
│  (Each shows: Score, Trend, Last Update)        │
├─────────────────────────────────────────────────┤
│  Active Alerts Panel (Red for Critical)          │
├─────────────────────────────────────────────────┤
│  Metrics Chart (24-hour line graph)              │
├─────────────────────────────────────────────────┤
│  Recent Reports & Transactions                   │
└─────────────────────────────────────────────────┘
```

**Key Features:**
- Auto-refresh metrics every 5 minutes
- Color-coded severity (red=critical, yellow=warning, green=stable)
- Trend arrows (↑↓ - ) for quick scanning
- "Trigger Alert" button for managers
- "View Full History" link to metrics timeline

---

### 2. **GlobalAdminDashboard.js** (Leader View)
**Location:** `src/pages/GlobalAdminDashboard.js`

**Render:**
```
┌──────────────────────────────────────────────┐
│  Global Health Score (0-100)                 │
│  Active Alerts Count | Critical | Warning    │
├──────────────────────────────────────────────┤
│  World Map (from existing InteractiveMap)    │
│  ├─ Communities as dots                      │
│  ├─ Color by health score (green→red)        │
│  └─ Click = drill to community               │
├──────────────────────────────────────────────┤
│  Regional Breakdown                          │
│  ├─ Africa: 13 communities, 2 critical       │
│  ├─ Asia: 16 communities, 1 critical        │
│  ├─ Europe: 14 communities, 0 critical      │
│  ├─ North America: 10 communities, 1 critical│
│  ├─ South America: 8 communities, 0 critical│
│  └─ Oceania: 8 communities, 2 critical      │
├──────────────────────────────────────────────┤
│  Resource Flows (Sankey Diagram)              │
│  └─ Shows active transactions between regions│
├──────────────────────────────────────────────┤
│  Critical Alerts Table (Sortable)             │
│  └─ Type | Community | Severity | Action     │
└──────────────────────────────────────────────┘
```

**Key Features:**
- Real-time global status
- Click regions on map to filter
- Resource flow visualization
- Approve/deny resource transactions
- Multi-community governance voting interface

---

### 3. **CommunityManagerSheet.js** (Data Input)
**Location:** `src/pages/CommunityManagerSheet.js`

**Form Structure:**
```
┌────────────────────────────────────┐
│  Community Manager Data Report      │
│  Reporting Period: [Daily/Monthly] │
├────────────────────────────────────┤
│ POPULATION & PROJECTS              │
│  Current Population: [input]        │
│  Population Change: [+/-/=]         │
│                                     │
│  New Projects Started:              │
│  ├─ Project 1: [text]              │
│  ├─ Add Project                     │
│                                     │
│  Projects Completed:                │
│  ├─ Project 1: [text]              │
│  └─ Add Project                     │
├────────────────────────────────────┤
│ RESOURCE AVAILABILITY               │
│  Energy Available: [input] kWh/day  │
│  Food Available: [input] tons       │
│  Water Available: [input] L/person  │
│  Labor Available: [input] people    │
│                                     │
│  RESOURCE NEEDS                     │
│  Energy Needed: [input] kWh/day     │
│  Food Needed: [input] tons          │
│  Water Needed: [input] L/person     │
│  Supplies Needed: [checkbox list]   │
├────────────────────────────────────┤
│ COMMUNITY NOTES                     │
│  [Large textarea]                   │
│  (Achievements, challenges, etc.)   │
├────────────────────────────────────┤
│ [Submit] [Save Draft] [Cancel]      │
└────────────────────────────────────┘
```

**Validation:**
- Required fields highlighted
- Population must be numeric
- Resource values validated > 0
- Success message after submit
- Auto-save to localStorage (draft)

---

### 4. **AlertPanel.js** (Alerts View)
**Location:** `src/components/AlertPanel.js`

**Features:**
- Scrollable list of active alerts
- Filter by: Type | Severity | Community
- Sort by: Newest | Most Severe | Oldest
- Each alert shows:
  - Icon (⚡🌊🌾🚑⚖️)
  - Title with community name
  - Current/Critical/Deficit values
  - Age (e.g., "2 hours ago")
  - [Acknowledge] [View Details] buttons

**Color Coding:**
```css
.alert-critical { background: #fee; border-left: 4px solid #c00; }
.alert-high { background: #ffe; border-left: 4px solid #f90; }
.alert-medium { background: #eff; border-left: 4px solid #06c; }
```

---

### 5. **MetricsCard.js** (Reusable Component)
**Location:** `src/components/MetricsCard.js`

```jsx
<MetricsCard
  title="Energy"
  score={65}
  trend="down"
  icon="⚡"
  color="amber"
  lastUpdate="10:25"
  details={{
    production: "150 kWh/day",
    consumption: "230 kWh/day",
    deficit: "80 kWh/day"
  }}
/>
```

**Displays:**
- Large score with emoji icon
- Color bar (green=good, yellow=warning, red=critical)
- Trend indicator (↑, ↓, or -)
- Quick stats below
- Hover = show tooltip with details

---

### 6. **ResourceMatchingWidget.js** (Smart Suggestions)
**Location:** `src/components/ResourceMatchingWidget.js`

**Triggered when:** Alert created or manager views "Need Help"

```
┌──────────────────────────────────────────┐
│  Resource Matching Suggestions            │
│  Energy Deficit Alert in Fiji-Nadi       │
├──────────────────────────────────────────┤
│  SUGGESTED DONORS (Same Region):          │
│                                           │
│  1. Samoa (Apia)                         │
│     └─ Can provide: 100 kWh/day          │
│     └─ Distance: 300 km (3 days)         │
│     └─ [Propose Transaction] [Details]   │
│                                           │
│  2. Australia (Sydney)                    │
│     └─ Can provide: 500 kWh/day          │
│     └─ Distance: 2000 km (15 days)       │
│     └─ [Propose Transaction] [Details]   │
│                                           │
│  3. New Zealand (Auckland)                │
│     └─ Can provide: 250 kWh/day          │
│     └─ Distance: 1800 km (12 days)       │
│     └─ [Propose Transaction] [Details]   │
│                                           │
│  💡 Transactions recorded on Terracare   │
└──────────────────────────────────────────┘
```

---

## 🔌 API Integration Examples

### Fetch Community Data
```javascript
useEffect(() => {
  fetch(`/api/communities/fiji-nadi`)
    .then(r => r.json())
    .then(data => {
      setCommunity(data);
      setMetrics(data.metrics);
      setAlerts(data.alerts);
    });
}, [communitySlug]);
```

### Fetch Global Alerts
```javascript
useEffect(() => {
  fetch(`/api/communities/`)
    .then(r => r.json())
    .then(communities => {
      const allAlerts = communities
        .flatMap(c => c.alerts)
        .filter(a => a.status === 'active');
      setAlerts(allAlerts);
    });
}, []);
```

### Submit Community Report
```javascript
const submitReport = async (formData) => {
  const response = await fetch(`/api/communities/${slugs}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      reportType: 'human',
      reportPeriod: 'daily',
      submittedBy: 'John Manager',
      populationUpdate: 42000,
      newProjectsStart: ['Solar Farm Expansion'],
      projectsCompleted: ['Water Tank Installation'],
      resourceAvailable: { energy: 150, food: 50, water: 100 },
      resourceNeeded: { energy: 80, food: 20, water: 0 },
      communityNotes: 'All systems operational. Solar output increased 15%.'
    })
  });
  return response.json();
};
```

### Propose Resource Transaction
```javascript
const proposeTransaction = async (fromSlug, toSlug, resource) => {
  const response = await fetch(`/api/communities/transactions/propose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromCommunitySlug: fromSlug,
      toCommunitySlug: toSlug,
      resourceType: 'energy',
      quantity: 100,
      unit: 'kWh',
      purpose: 'Emergency drought relief',
      notes: 'High-priority allocation'
    })
  });
  return response.json();
};
```

---

## 🎨 Design System (Using Existing Glasmorphic Theme)

**Colors:**
- **Healthy (Green):** #10b981
- **Warning (Yellow):** #f59e0b
- **Critical (Red):** #ef4444
- **Info (Blue):** #3b82f6
- **Dark BG:** #1a1a2e
- **Light Text:** #e0e0e0

**Component Classes:**
```css
.metric-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); }
.alert-panel { background: rgba(255,0,0,0.05); border: 1px solid rgba(255,0,0,0.2); }
.button-primary { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
```

---

## 📊 Real-Time Updates Strategy

**Option A: Polling (Simpler)**
```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetch(`/api/communities/${slug}`)
      .then(r => r.json())
      .then(setCommunity);
  }, 5000); // Every 5 seconds
  
  return () => clearInterval(interval);
}, [slug]);
```

**Option B: WebSocket (Better)**
```javascript
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3001/api/communities/live');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.communityId === community.id) {
      setCommunity(prev => ({ ...prev, ...data }));
    }
  };
  
  return () => ws.close();
}, [community.id]);
```

---

## 🚀 Implementation Order

1. **MetricsCard.js** - Base component for all metric displays
2. **CommunityDashboard.js** - Main view (uses MetricsCard)
3. **AlertPanel.js** - Alert list display
4. **CommunityManagerSheet.js** - Data input form
5. **GlobalAdminDashboard.js** - Overview (integrates all components)
6. **ResourceMatchingWidget.js** - Smart matching display

---

## ✅ Testing Checklist

- [ ] Fetch 64 communities successfully
- [ ] Display community detail with all 6 metrics
- [ ] Show active alerts sorted by severity
- [ ] Filter alerts by type and community
- [ ] Submit community report via form
- [ ] Propose resource transaction
- [ ] Accept/reject transaction
- [ ] View metrics history (30 days)
- [ ] Global dashboard shows all regions
- [ ] Resource matching suggests correct donors

---

**Total Estimated Time:** 3-4 hours for full dashboard implementation

**Ready to build components?**

