# Domain Extension Pages - Glassmorphic Transformation Status

## ✅ COMPLETED (5/20)

### Water Domain (3/5)
- ✅ **WaterUsage.js** - COMPLETE
  - Light/dark adaptive background
  - GlassSection header with return button (#06b6d4 cyan)
  - GlassGrid with 3 summary cards
  - All data logic preserved
  - Gradient text headings (from-cyan-500 to-blue-500)

- ✅ **WaterLeaks.js** - COMPLETE
  - GlassSection header with return button
  - GlassGrid with 3 alert summary cards (conditional coloring for active leaks)
  - Leak events list in GlassSection
  - Sensor network health in GlassGrid
  - All IoT sensor data preserved

- ✅ **WaterQuality.js** - COMPLETE
  - GlassSection header with return button
  - GlassGrid with quality metric cards (status badges, chemical parameters)
  - Quality summary with 4 metric cards
  - All water testing data preserved

### Energy Domain (1/5)
- ✅ **EnergySolar.js** - COMPLETE  
  - Light/dark adaptive background
  - GlassSection header with return button (#b45309 amber)
  - GlassGrid with 4 summary cards
  - Array Details as GlassSection with GlassGrid of array cards
  - System Performance Summary with GlassGrid
  - All solar array data preserved

## 🔄 IN PROGRESS (1/20)
- **Next up:** WaterRecycling.js, WaterIrrigation.js

## ⏳ PENDING (15/20)

### Water Domain (2 remaining)
- ❌ **WaterRecycling.js** - Aquaponics systems (partially done)
- ❌ **WaterIrrigation.js** - Irrigation zone planning (partially done)

### Energy Domain (4 remaining)
- ❌ **EnergyGrid.js** - Grid power monitoring
- ❌ **EnergyForecast.js** - Energy prediction models
- ❌ **EnergyLoad.js** - Load management
- ❌ **EnergyBattery.js** - Battery storage systems

### Climate Domain (5 total)
- ❌ **ClimateAir.js** - Air quality monitoring
- ❌ **ClimateIndoor.js** - Indoor climate control
- ❌ **ClimateHumidity.js** - Humidity management
- ❌ **ClimateForecast.js** - Weather predictions
- ❌ **ClimateVentilation.js** - Ventilation systems

### Food Domain (4-5 total)
- ❌ **FoodStorage.js** - Food inventory & storage
- ❌ **FoodNutrition.js** - Nutrition optimization
- ❌ **FoodPlanning.js** - Meal planning
- ❌ **FoodProduction.js** - Production tracking
- ❌ **FoodSafety.js** (verify exists) - Food safety monitoring

---

## 📋 TRANSFORMATION TEMPLATE

### Required Pattern (from WaterUsage.js & EnergySolar.js)

```javascript
// 1. IMPORTS
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import sofieCore from "../../core/SofieCore";
import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";

export default function PageName() {
  // 2. NAVIGATION HOOKS
  const navigate = useNavigate();
  const location = useLocation();
  const ringData = location.state || {};
  
  // ... existing state hooks ...

  // 3. LOADING STATE (light/dark adaptive)
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
        <GlassCard colors={{ primary: "DOMAIN_COLOR", secondary: "SECONDARY_COLOR" }}>
          <div className="p-8 text-gray-700 dark:text-gray-300">Loading...</div>
        </GlassCard>
      </div>
    );
  }

  // 4. MAIN RETURN
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* 5. HEADER SECTION */}
        <GlassSection colors={{ primary: "DOMAIN_COLOR", secondary: "SECONDARY_COLOR" }} elevation="high">
          <div className="py-12 px-8" style={{ position: 'relative' }}>
            <button
              onClick={() => navigate("/", { state: { activeRing: ringData.activeRing } })}
              className="return-button"
              style={{
                position: 'absolute',
                top: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#HEX_COLOR'  // Domain-specific color
              }}
            >
              <FaArrowLeft size={12} /> {ringData.ringName || 'Back'}
            </button>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-DOMAIN_COLOR-500 to-SECONDARY_COLOR-500 bg-clip-text text-transparent">
              🎯 Page Title
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-200 max-w-2xl">
              Page description
            </p>
          </div>
        </GlassSection>

        {/* 6. SUMMARY CARDS */}
        <GlassGrid cols={1} colsMd={3-4} gap={5}>
          <GlassCard colors={{ primary: "DOMAIN_COLOR", secondary: "SECONDARY_COLOR" }}>
            <div className="p-8 text-center min-h-[160px] flex flex-col justify-center">
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">Metric Label</div>
              <div className="text-5xl font-bold text-DOMAIN_COLOR-600 dark:text-DOMAIN_COLOR-400">{value}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">Sub-label</p>
            </div>
          </GlassCard>
          {/* Repeat for other summary cards */}
        </GlassGrid>

        {/* 7. CONTENT SECTIONS */}
        <GlassSection colors={{ primary: "DOMAIN_COLOR", secondary: "SECONDARY_COLOR" }}>
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-DOMAIN_COLOR-500 to-SECONDARY_COLOR-500 bg-clip-text text-transparent">
              Section Title
            </h2>
            {/* Content goes here - use GlassGrid/GlassCard as needed */}
          </div>
        </GlassSection>

      </div>
    </div>
  );
}
```

---

## 🎨 DOMAIN COLOR MAPPING

### Water Domain
- **Primary:** cyan
- **Secondary:** blue
- **Hex:** #06b6d4 (for return button)
- **Gradient:** from-cyan-500 to-blue-500
- **Text colors:** text-cyan-600 dark:text-cyan-400

### Energy Domain
- **Primary:** amber
- **Secondary:** orange
- **Hex:** #b45309 (for return button)
- **Gradient:** from-amber-500 to-orange-500
- **Text colors:** text-amber-600 dark:text-amber-400

### Climate Domain
- **Primary:** emerald
- **Secondary:** teal
- **Hex:** #059669 (for return button)
- **Gradient:** from-emerald-500 to-teal-500
- **Text colors:** text-emerald-600 dark:text-emerald-400

### Food Domain
- **Primary:** amber
- **Secondary:** orange
- **Hex:** #ea580c (for return button)
- **Gradient:** from-amber-500 to-orange-500
- **Text colors:** text-amber-600 dark:text-amber-400

---

## 🔧 KEY TRANSFORMATION STEPS

For each file:

1. **Update Imports**
   - Remove `import { glassPanel } from "../../theme/glassTokens";`
   - Add `import { GlassSection, GlassCard, GlassGrid } from "../../theme/GlassmorphismTheme";`
   - Add `import { useNavigate, useLocation } from "react-router-dom";`
   - Add `import { FaArrowLeft } from "react-icons/fa";`

2. **Add Navigation Hooks**
   ```javascript
   const navigate = useNavigate();
   const location = useLocation();
   const ringData = location.state || {};
   ```

3. **Update Loading State**
   - Change background from `from-gray-900 via-DOMAIN-900 to-gray-900` to light/dark adaptive
   - Replace `<div style={glassPanel}>` with `<GlassCard>`
   - Update text colors to light/dark adaptive

4. **Update Main Return**
   - Change background to light/dark adaptive
   - Add `max-w-7xl mx-auto space-y-8` wrapper
   - Replace all `style={{...glassPanel, ...}}` with `GlassSection` or `GlassCard`

5. **Transform Header**
   - Use `GlassSection` with `elevation="high"`
   - Add return button with absolute positioning
   - Use gradient text for heading

6. **Transform Summary Cards**
   - Use `GlassGrid` with appropriate columns (cols={1} colsMd={3-4})
   - Wrap each card in `GlassCard`
   - Use `min-h-[160px]` and flex centering
   - Update text colors to light/dark adaptive

7. **Transform Content Sections**
   - Replace inline glassPanel divs with `GlassSection`
   - Add `p-8` padding
   - Use gradient text for section headings
   - For grids of items, use `GlassGrid` with `GlassCard` children

8. **Preserve All Data Logic**
   - Keep all useEffect hooks unchanged
   - Maintain all calculations and filtering
   - Preserve all color-coded data visualization (status colors, progress bars, etc.)
   - Keep all existing functionality intact

9. **Test Build**
   ```powershell
   npm run build
   ```

10. **Commit**
    ```powershell
    git add -A
    git commit -m "transform: Convert FILENAME to glassmorphic design with GlassSection/GlassCard"
    ```

---

## 📊 PROGRESS METRICS

- **Total Pages:** 20
- **Completed:** 2 (10%)
- **Remaining:** 18 (90%)
- **Estimated Time:** 15-20 hours (45-60 min per page)
- **Build Status:** ✅ Passing (as of last commit)

---

## 🚀 QUICK START FOR NEXT FILE

Example: Transform WaterLeaks.js next

1. Open `src/pages/water/WaterLeaks.js`
2. Copy the template above
3. Set colors: cyan/blue, #06b6d4
4. Replace imports
5. Add navigation hooks
6. Transform loading state
7. Transform main return with 3 sections:
   - Alert Summary (3 metric cards)
   - Leak Events (list of leak cards)
   - Sensor Health (grid of sensor cards)
8. Test build: `npm run build`
9. Commit when successful

---

## 📝 NOTES

- **DO NOT** remove return buttons from any page
- **DO** preserve all existing data logic and calculations
- **DO** maintain domain-specific color schemes for data visualization
- **DO** test build after each file transformation
- **DO** commit after each successful transformation
- **Pattern files:** Use `WaterUsage.js` and `EnergySolar.js` as reference templates

---

Last Updated: After completing EnergySolar.js transformation
