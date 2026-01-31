# Map Integration Technical Reference

## File Structure

```
src/
├── components/
│   ├── MapPanel.js                 ✨ NEW - Integration wrapper
│   ├── InteractiveMap.js           ✓ Existing - Canvas rendering
│   ├── RegionSelector.js           ✏️ MODIFIED - Added MapPanel
│   ├── SystemShell.js              ✓ Existing - Navbar container
│   └── ...
├── services/
│   ├── GlobalMapService.js         ✓ Existing - Community data
│   ├── MapProjection.js            ✓ Existing - Projection math
│   ├── RegionService.js            ✓ Existing - Region backend
│   └── ...
├── context/
│   ├── RegionContext.js            ✓ Existing - Region state
│   └── ...
└── ...
```

## Component Relationships

```
SystemShell
│
└─ Header
   └─ RegionSelector (MODIFIED)
      │
      ├─ Select Dropdown
      │  └─ uses: RegionContext (selectedRegion, selectRegion)
      │
      └─ MapPanel (NEW)
         │
         ├─ state: selectedCommunity, isExpanded
         ├─ data: GlobalMapService.getCommunities()
         ├─ context: RegionContext (selectedRegion)
         │
         └─ InteractiveMap
            │
            ├─ props: communities, onCommunitySelect, defaultLayer
            ├─ service: MapProjection
            ├─ canvas: 1200x600px Mercator projection
            │
            └─ Features:
               ├─ Zoom (wheel)
               ├─ Pan (drag)
               ├─ Click to select
               ├─ Hover effects
               └─ Layer switching
```

## Data Flow

### 1. Initial Load
```
SystemShell mounts
  → RegionSelector renders
    → useRegion() hook initializes
      → RegionContext provides initial state
        → selectedRegion = null
        → MapPanel returns null (no region selected)
```

### 2. Region Selection
```
User selects region from dropdown
  → selectRegion() called with region object
    → RegionContext updates selectedRegion state
      → RegionSelector re-renders
        → MapPanel now has selectedRegion
          → MapPanel.useEffect loads communities
            → GlobalMapService.getCommunities()
              → 64 communities loaded
              → State updated: setCommunities(allCommunities)
```

### 3. View Map
```
User clicks "View Regional Map" button
  → setIsExpanded(true)
    → MapPanel expands
      → InteractiveMap renders
        → regionCommunities filtered by continent
          → Communities for that region displayed on canvas
```

### 4. Interact with Map
```
User interacts (click, drag, scroll)
  → InteractiveMap event handlers triggered
    → MapProjection calculations performed
    → Canvas redrawn
    → Community selected/details updated
```

## Region to Continent Mapping

```javascript
const continentMap = {
  'North America': 'North America',
  'Australia': 'Oceania',
  'India': 'Asia',
  'Europe': 'Europe',
  'UK': 'Europe',
  'USA': 'North America',
  'Brazil': 'South America',
  'Peru': 'South America',
  'Colombia': 'South America',
};
```

## Component Props

### MapPanel
```javascript
props: {
  // (none - uses context)
}

state: {
  communities: [64 communities from GlobalMapService],
  selectedCommunity: null | Community object,
  isExpanded: boolean
}

context: {
  selectedRegion: Region | null
}
```

### InteractiveMap
```javascript
props: {
  communities: Community[],           // Array of communities to render
  onCommunitySelect: (c) => void,    // Callback when community clicked
  defaultLayer: string               // Default metric (e.g., 'health')
}

state: {
  currentLayer: string,
  selectedCommunity: Community | null,
  hoveredCommunity: Community | null
}
```

## Key Methods & Functions

### GlobalMapService
```javascript
getCommunities()           // Returns array of 64 communities
getCommunitiesByContinent(name)  // Filter by continent
getContinent(name)         // Get continent data
getContinentMetrics(name)  // Calculate metrics for continent
getLayerDescription(layer) // Get human-readable metric name
```

### MapProjection
```javascript
project(lat, lng)          // Convert lat/lng to pixel coordinates
unproject(x, y)           // Convert pixels to lat/lng
zoom(factor, origin)      // Zoom in/out around origin
pan(dx, dy)              // Pan map by delta
reset()                  // Reset zoom/pan to default
```

### MapPanel
```javascript
handleCommunitySelect(community)  // Update selected community
                                 // Re-render detail view
```

### InteractiveMap (via useRef)
```javascript
canvasRef                  // Reference to canvas element
projectionRef              // Reference to MapProjection instance
isDraggingRef             // Track drag state
dragStartRef              // Store drag start coordinates

handleMouseDown(e)         // Start pan
handleMouseMove(e)         // Pan or hover
handleMouseUp(e)          // End pan
handleClick(e)            // Select community
handleWheel(e)            // Zoom

draw()                    // Render canvas
```

## Styling Classes

### MapPanel Button
```
w-full px-4 py-2 rounded-lg 
bg-gradient-to-r from-purple-500/20 to-blue-500/20 
border border-purple-400/30 text-white text-sm font-medium
hover:from-purple-500/30 hover:to-blue-500/30
```

### Map Container
```
bg-gradient-to-br from-slate-900/50 to-slate-800/50
backdrop-blur-md rounded-lg border border-slate-700/50 p-4
```

### Detail View
```
bg-slate-800/50 rounded-lg p-4 border border-slate-700/50
```

### Canvas
```
w-full bg-gradient-to-br from-slate-950 to-slate-900
rounded-lg border border-slate-700 cursor-grab
active:cursor-grabbing shadow-xl
```

## Event Listeners (Canvas)

```javascript
canvas.addEventListener('mousedown', handleMouseDown)    // Start drag
canvas.addEventListener('mousemove', handleMouseMove)    // Drag/hover
canvas.addEventListener('mouseup', handleMouseUp)        // End drag
canvas.addEventListener('click', handleClick)             // Select
canvas.addEventListener('wheel', handleWheel, {          // Zoom
  passive: false  // Allow preventDefault
})
```

## Color Coding System

### Metric Values
```
>= 85  → Green (🟢)  "Excellent"
75-84  → Blue (🔵)   "Good"
60-74  → Yellow (🟡) "Needs attention"
< 60   → Red (🔴)    "Critical"
```

### Canvas Colors
```
Selected   → Purple (rgb(168, 85, 247))
Hovered    → White (rgb(249, 250, 251))
Metric val → Green/Blue/Yellow/Red based on above
```

## Performance Optimization

1. **Data Loading**
   - Communities loaded once on MapPanel mount
   - GlobalMapService singleton prevents duplicate loads
   - Filtering done in memory (64 items - negligible)

2. **Rendering**
   - Canvas only updated on state/prop changes
   - Event handlers use refs to avoid re-renders
   - MapPanel conditional rendering (not shown if no region)

3. **State Management**
   - Minimal state in MapPanel (3 items)
   - Context subscription only when needed
   - No unnecessary re-renders

## Testing Endpoints

- App URL: `http://localhost:3000`
- Region dropdown: Located in navbar header
- Map toggle: Appears below region selector when region selected
- Map expansion: Click "View Regional Map" or "Hide Map"

## Debugging Tips

### Check if MapPanel renders
```javascript
// In browser console:
// If region selected and communities loaded, should see:
document.querySelector('[class*="MapPanel"]')
```

### Verify communities loaded
```javascript
// Check React DevTools:
// MapPanel component → state → communities array (should have 64 items)
```

### Check community filtering
```javascript
// InteractiveMap props → communities array
// Should only show communities from selected region's continent
```

### Verify canvas rendering
```javascript
// Check if canvas element exists:
document.querySelector('canvas')
// Should be 1200x600px with dark background
```

## Environment Variables

Currently using defaults:
```
REACT_APP_BACKEND_URL = "http://localhost:3001/api"
```

No new environment variables required for map integration.

## Browser Compatibility

- Modern browsers with Canvas support (all current versions)
- Requires ES6+ JavaScript support
- Wheel event listener uses passive: false (modern browsers only)
- CSS grid and flexbox support

## Accessibility Notes

- Canvas interaction documented with text instructions
- Color coding supplemented by metric values
- Keyboard navigation not implemented (mouse-based for now)
- Consider adding tooltip accessibility in future

## Future Enhancement Points

1. **Mobile Support**
   - Touch events for zoom/pan
   - Mobile-optimized detail view

2. **Data Integration**
   - Real-time updates from backend
   - WebSocket connection for live metrics

3. **Advanced Features**
   - Community clustering at zoom levels
   - Heat maps for specific metrics
   - Network visualization between communities
   - Historical trend charts

4. **Customization**
   - User preferences for default metric
   - Saved map views
   - Custom community filters

---

## Summary

The map integration is a clean, maintainable implementation that:
- ✅ Leverages existing services and context
- ✅ Follows React component patterns
- ✅ Maintains performance
- ✅ Provides excellent UX
- ✅ Ready for future enhancements
