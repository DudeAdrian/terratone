# PowerShell script to apply glassmorphic transformations to Food domain pages
# This script applies consistent patterns across HarvestForecast.js and NutritionOptimization.js

$harvestPath = "c:\Users\squat\sofie-systems-ui\src\pages\HarvestForecast.js"
$nutritionPath = "c:\Users\squat\sofie-systems-ui\src\pages\NutritionOptimization.js"

# Read files
$harvest = Get-Content $harvestPath -Raw
$nutrition = Get-Content $nutritionPath -Raw

# ===== HarvestForecast.js Transformations =====

# 1. Wrap main return with glassmorphic background
$harvest = $harvest -replace 'return \(\s+<div className="space-y-6">', @'
return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-green-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
'@

# 2. Add closing divs at the end
$harvest = $harvest -replace '</div>\s+</div>\s+</div>\s+\);\s+};\s+export default HarvestForecast;', @'
</div>
      </div>
    </div>
  );
};

export default HarvestForecast;
'@

# 3. Replace Header section
$harvest = $harvest -replace '<div className="bg-gradient-to-r from-green-600 to-lime-600.*?</div>\s+</div>', @'
<GlassSection colors={{ primary: "green", secondary: "emerald" }} elevation="high">
        <div className="py-12 px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">🌾 Global Harvest Forecast</h1>
          <p className="text-lg text-green-700 dark:text-green-200">12-month production planning across all climate zones for sustainable aquaponics</p>
        </div>
      </GlassSection>
'@

# 4. Replace white stat boxes with GlassCard
$harvest = $harvest -replace 'bg-white p-4 rounded-lg shadow-md border-l-4', 'GlassCard'

# Write back
Set-Content $harvestPath $harvest
Write-Host "✅ HarvestForecast.js transformed"

# ===== NutritionOptimization.js Transformations =====

# 1. Add GlassComponent imports
$nutrition = $nutrition -replace 'import sofieCore from.*?;', @'
import sofieCore from "../core/SofieCore";
import { GlassCard, GlassSection, GlassGrid } from "../theme/GlassmorphismTheme";
'@

Write-Host "✅ NutritionOptimization.js transformed (imports)"

Set-Content $nutritionPath $nutrition

Write-Host "✅ Transformation script completed"
