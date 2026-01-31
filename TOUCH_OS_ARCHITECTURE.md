# 🌱 Sofie Systems & 🏥 Heartware - Touch-Screen OS Architecture

## Overview

Both **Sofie Systems** (Sustainability OS) and **Heartware** (Healthcare OS) are now unified operating systems optimized for **touch-screen kiosk/panel deployment**. They run on dedicated hardware with a consistent UX paradigm.

## Architecture

### Hardware Target
- **Device**: Touch-screen panels, kiosks, industrial tablets, Raspberry Pi + display
- **Display**: 21"–55" touch screens (landscape orientation preferred)
- **Input**: Touch-only (no keyboard/mouse)
- **Connectivity**: LAN/WiFi; offline-first capable
- **Runtime**: Browser-based (Chromium, Webkit) or Electron wrapper for standalone deployment

### UX Paradigm: Full-Screen OS

```
┌─────────────────────────────────────┐
│  HEADER (Compact 16px height)       │
│  Page Title + Region Selector       │
├─────────────────────────────────────┤
│                                     │
│      MAIN CONTENT AREA              │
│      (Full-screen scrollable)       │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ FOOTER (Status bar, 12px)           │
│ Mode | Time | Dark Mode Toggle      │
├─────────────────────────────────────┤
│ BOTTOM NAV (Large buttons, 96px)    │
│ 6 Buttons: Home | Services | Map... │
└─────────────────────────────────────┘
```

### Core Components

#### 1. **SystemShellTouchOS.js** (Unified Shell)
- **Location**: `src/components/SystemShellTouchOS.js`
- **Props**: `children` (content pages)
- **Features**:
  - Bottom navigation bar (6 large touch buttons, 96px height)
  - Compact header (context + region selector)
  - Status footer (mode, time, dark mode toggle)
  - Full-screen region selection modal
  - Touch-sized tap targets (48px+ minimum)

#### 2. **Bottom Navigation**
Six primary navigation items (both OS variants):

**Sofie Systems (Sustainability)**:
- 🏠 Home
- 🗺️ Map (regional community map)
- 🔧 Services (energy, water, food, etc.)
- 🧘 Wellness (health + herbal)
- 📊 Dashboard (metrics & analytics)
- ⚙️ Settings (preferences, mode, theme)

**Heartware (Healthcare)**:
- 🏥 Home
- 👥 Patients
- 📅 Appointments
- 📋 Health Records
- 📊 Dashboard (clinical metrics)
- ⚙️ Settings (preferences, mode, theme)

#### 3. **Region Selection Modal**
- Triggered by **📍 Region** button in header
- Full-screen modal overlay
- Large grid of region buttons (each 48px+ touch target)
- Selected region persists in `RegionContext`
- Updates page title and content dynamically

#### 4. **Footer Status Bar**
- **Left**: Current mode (`👤 Manual` or `🤖 Autopilot`)
- **Center**: Current time (HH:MM format)
- **Right**: Dark/Light mode toggle

## Data Flow

### Region Selection
```
User taps "📍 Region" button in header
  ↓
showRegionModal = true (full-screen modal appears)
  ↓
User taps region button
  ↓
handleSelectRegion(region) called
  ↓
RegionContext.selectRegion(region) updates global state
Modal closes, page title updates with selected region
```

### Navigation
```
User taps bottom nav button
  ↓
React Router navigates to path
  ↓
Page renders within main content area
  ↓
Header title updates (getPageTitle() function)
  ↓
Active nav button highlights (gradient background)
```

## Responsive Behavior

- **Header**: Always visible, compact (48px)
- **Main**: Takes remaining space, scrollable if content > viewport
- **Footer**: Always visible, minimal (48px)
- **Bottom Nav**: Always visible, fixed (96px)
- **Total fixed height**: 192px; content gets viewport height minus 192px

## Touch Accessibility

- **Button/Tap Targets**: Minimum 48px height/width (WCAG AAA)
- **Spacing**: 4–8px gaps between interactive elements to prevent accidental taps
- **Font Size**: 16px+ for labels, 20px+ for icons
- **Contrast**: WCAG AA+ for light/dark modes
- **Haptic**: Ready for hardware integration (future)

## Color Schemes

### Sofie Systems (Sustainability)
- **Primary**: Green/Emerald (`emerald-500`, `green-600`)
- **Background**: Gray/White with green accents
- **Active**: Gradient `from-emerald-400 to-green-500`

### Heartware (Healthcare)
- **Primary**: Blue/Cyan (`blue-500`, `cyan-500`)
- **Background**: Gray/White with blue accents
- **Active**: Gradient `from-blue-400 to-cyan-500`

## Offline-First Strategy

- **LocalStorage**: Region selection, dark mode, user preferences
- **Service Workers**: Ready for PWA caching (future enhancement)
- **Sync**: Backend API calls queued and retried when connectivity returns

## Backend Integration (sofie-backend)

Both OSes connect to a unified **sofie-backend** API:

```
GET /api/regions                    # Fetch available regions
GET /api/regions/{id}/communities   # Communities in region
POST /api/wellness-intake           # Wellness submissions
GET /api/health-records             # Patient records (Heartware)
... (48+ endpoints across services)
```

**Environment Variable**: `REACT_APP_BACKEND_URL` (e.g., `http://localhost:3001/api`)

## Deployment

### Development
```bash
# sofie-systems-ui
npm start  # localhost:3000

# heartware-ui
npm start  # localhost:3000

# sofie-backend
npm run dev  # localhost:3001
```

### Production (Touch-Screen Kiosk)
```bash
# Option 1: Embedded browser
npm run build
serve -s build

# Option 2: Electron wrapper (for standalone hardware)
npm run build
npm run electron  # (if configured)
```

### Hardware Deployment
1. Deploy to Raspberry Pi or industrial tablet
2. Configure environment for local backend (or cloud API)
3. Set `REACT_APP_BACKEND_URL` to backend IP/domain
4. Kiosk browser starts app at http://localhost:3000
5. System autostarts with hardware (systemd service or startup script)

## Future Enhancements

- **Hardware Integration**: GPS, camera, sensors via browser APIs
- **Voice Commands**: Speech-to-text for accessibility
- **Gesture Support**: Swipe navigation, pinch-zoom
- **Offline Mode**: Full app functionality without internet
- **Multi-User**: Login/logout with role-based access
- **Analytics**: Touch heatmaps, user engagement tracking
- **Firmware Updates**: Auto-update app and backend on kiosk boot

## File Structure

```
sofie-systems-ui/
├── src/
│   ├── components/
│   │   ├── SystemShellTouchOS.js  ← Main OS shell
│   │   ├── InteractiveMap.js       ← Regional map
│   │   └── ...
│   ├── pages/
│   │   ├── Home.js
│   │   ├── GlobalMap.js             ← Region + community map
│   │   ├── Services.js
│   │   └── ...
│   ├── context/
│   │   ├── RegionContext.js         ← Region selection state
│   │   └── ...
│   └── App.js                        ← Routes + shell wrapper

heartware-ui/
├── src/
│   ├── components/
│   │   ├── SystemShellTouchOS.js  ← Same OS shell (healthcare variant)
│   │   └── ...
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Patients.js
│   │   ├── Appointments.js
│   │   └── ...
│   └── App.js

sofie-backend/
├── routes/
│   ├── regions.js
│   ├── communities.js
│   ├── wellness.js
│   ├── health.js
│   └── ...
└── ... (database, auth, services)
```

## Success Criteria

- ✅ Touch-only navigation (no mouse required)
- ✅ Full-screen layouts (no wasted space)
- ✅ 48px+ tap targets (accessibility)
- ✅ Responsive to portrait/landscape
- ✅ Works on 21"+ displays and tablets
- ✅ Fast navigation (<200ms per tap)
- ✅ Offline functionality (LocalStorage)
- ✅ Consistent UX across both OS variants

---

**Both Sofie Systems and Heartware are now unified touch-screen operating systems ready for kiosk and panel deployment.**
