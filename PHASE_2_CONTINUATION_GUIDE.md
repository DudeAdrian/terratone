# Phase 2 Continuation Guide 🚀

## Quick Stats
- ✅ **24 pages integrated** (Water, Energy, Food, Climate, Community, + 4 business pages)
- ✅ **40+ API endpoints** created
- ✅ **12 custom hooks** implemented
- 🚀 **20+ pages remaining** for Phase 2e

---

## To Continue Integration Process:

### Pattern for Each Remaining Page:

```javascript
// STEP 1: Identify page location & current implementation
// Example: src/pages/HerbalLibrary.js

// STEP 2: Add API methods to src/services/api.js
async getHerbalItems(regionId = null) {
  const query = regionId ? `?regionId=${regionId}` : '';
  return this.request(`/api/herbal-library/items${query}`);
}

// STEP 3: Create custom hook in src/hooks/useApi.js
export const useHerbalData = (regionId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    try {
      const items = await api.getHerbalItems(regionId);
      setData(items);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load herbal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [regionId]);

  return { data, loading, error, refetch };
};

// STEP 4: Import and integrate in page component
import { useHerbalData } from '../hooks/useApi';

const HerbalLibrary = () => {
  const { data, loading, error, refetch } = useHerbalData();
  
  // Add loading/error UI
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorWithRetry onRetry={refetch} />;
  
  // Render with API data
  return <MainContent data={data} />;
};

// STEP 5: Build and test
npm run build
```

---

## High-Priority Pages to Integrate Next:

### 1. **HerbalLibrary.js**
**Location:** `src/pages/HerbalLibrary.js`  
**Current Use:** Only sofieCore.getService("herbalLibrary")  
**Needed APIs:** getHerbalItems, searchHerbal, getRemedy  
**Time Estimate:** 30 mins

### 2. **SeedBank.js**
**Location:** `src/pages/SeedBank.js`  
**Current Use:** Only sofieCore.getService("seedBank")  
**Needed APIs:** getSeedVarieties, searchSeeds, getCheckoutInfo  
**Time Estimate:** 30 mins

### 3. **KnowledgeBase.js**
**Location:** `src/pages/KnowledgeBase.js`  
**Current Use:** Only sofieCore.getService("knowledgeBase")  
**Needed APIs:** getArticles, searchArticles, getCategory  
**Time Estimate:** 30 mins

### 4. **Marketplace.js**
**Location:** `src/pages/Marketplace.js`  
**Current Use:** Only sofieCore.getService("marketplace")  
**Needed APIs:** getListings, searchListings, getTradeHistory  
**Time Estimate:** 45 mins

### 5. **Inventory.js**
**Location:** `src/pages/Inventory.js`  
**Current Use:** Only sofieCore.getService("inventory")  
**Needed APIs:** getInventory, searchItems, getCategory  
**Time Estimate:** 45 mins

---

## API Endpoint Patterns by Domain:

### Library Pages (Herbal, Seeds, Knowledge, etc.)
```
GET /api/{domain}-library
GET /api/{domain}-library/{id}
GET /api/{domain}-library?search={query}
GET /api/{domain}-library/categories
POST /api/{domain}-library/{id}/favorite
```

### Management Pages (Marketplace, Inventory, etc.)
```
GET /api/{domain}/items
GET /api/{domain}/items/{id}
POST /api/{domain}/items
PUT /api/{domain}/items/{id}
DELETE /api/{domain}/items/{id}
GET /api/{domain}/history
```

### Dashboard Pages (Admin, System, Alert Center)
```
GET /api/system/overview
GET /api/system/status
GET /api/system/logs?limit={limit}
GET /api/system/alerts?status={status}
PUT /api/system/alerts/{id}/acknowledge
```

---

## Common Pitfalls to Avoid:

1. ❌ **Don't forget error handling**
   - Always add try-catch in hooks
   - Always render error UI
   - Always provide retry button

2. ❌ **Don't hardcode values**
   - Use state for all data
   - Support region filtering
   - Support pagination parameters

3. ❌ **Don't duplicate code**
   - Create hooks for reusable patterns
   - Follow the 12-hook model
   - DRY principle

4. ❌ **Don't forget to export**
   - Export hooks from useApi.js
   - Export api methods as public
   - Test build after changes

5. ❌ **Don't break existing functionality**
   - Always test with `npm run build`
   - Keep sofieCore fallback
   - Check no unused variable warnings

---

## Testing Checklist for Each Page:

- [ ] Page loads without errors (`npm run build` passes)
- [ ] Loading spinner appears while fetching
- [ ] Data displays correctly when loaded
- [ ] Error UI appears when API fails
- [ ] Retry button works (fetches data again)
- [ ] Region filter works (if applicable)
- [ ] Mobile responsive design works
- [ ] Web3 status indicator present (if applicable)

---

## Command Reference:

```bash
# Build project
npm run build

# Check specific file errors
npm run build -- --verbose

# Run development server
npm start

# Check for unused variables in specific file
grep -n "const.*=.*useState" src/pages/PageName.js

# Count total API methods in api.js
grep -c "async get" src/services/api.js
```

---

## File Locations Quick Reference:

```
📁 src/
├── 📄 services/api.js              ← Add new API methods here
├── 📄 hooks/useApi.js              ← Add new hooks here
└── 📁 pages/
    ├── 📄 GlobalNetwork.js         ✅ DONE
    ├── 📄 Governance.js            ✅ DONE
    ├── 📄 Expansion.js             ✅ DONE
    ├── 📄 Resilience.js            ✅ DONE
    ├── 📄 HerbalLibrary.js         🚀 NEXT
    ├── 📄 SeedBank.js              🚀 NEXT
    ├── 📄 KnowledgeBase.js         🚀 NEXT
    ├── 📄 Marketplace.js           🚀 NEXT
    └── ... 16+ more pages
```

---

## Metrics to Track:

Each completed page should add:
- ✅ 2-3 new API endpoints
- ✅ 1 new custom hook
- ✅ 30-50 lines of integration code
- ✅ Loading/error/retry UI
- ✅ No new warnings in build

**Goal for Phase 2e:** Integrate 10 pages = +30 endpoints, +10 hooks, +500-1000 LOC

---

## Success Criteria:

✅ **Page Integration Complete When:**
1. No compilation errors
2. Page loads without errors
3. Uses API hooks (not just sofieCore)
4. Has loading state UI
5. Has error state with retry
6. Works offline with sofieCore fallback
7. Supports region filtering (if applicable)
8. Mobile responsive
9. No unused variable warnings

---

## When Stuck:

1. **Check error message** in `npm run build` output
2. **Compare with existing page** like GlobalNetwork.js or Resilience.js
3. **Verify API method exists** in src/services/api.js
4. **Check hook exists** in src/hooks/useApi.js
5. **Ensure imports are correct** (relative paths)
6. **Test fallback** - does sofieCore service exist?

---

## Next Session Goals:

🎯 Integrate 5-10 high-priority pages (HerbalLibrary, SeedBank, KnowledgeBase, Marketplace, Inventory)  
🎯 Add 20-30 new API endpoints  
🎯 Create 5-10 new custom hooks  
🎯 Maintain build success  
🎯 Prepare backend team with API spec  

---

**Ready to continue! Start with HerbalLibrary.js - it's the quickest win. 💪**
