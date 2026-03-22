# Full Feature Activation - Implementation Steps

## Plan Breakdown (Approved ✅)
**Backend:** Minor fixes (ACCESS_KEY=JASMINA_SECRET_2026, proxy auth).
**Frontend:** Profile dropdown (Sidebar/ProfileView), ModernDashboard (Proxy View + Playground + Translator), ApiTester cleanup.
**Security:** Bearer token + ACCESS_KEY.
**Syntax Highlighter:** react-syntax-highlighter.

## TODO Steps (Sequential)

### 1. Backend Security & Proxy Auth [COMPLETED ✅]
   - [x] Update utils.ts/authorize: Hardcode/fallback ACCESS_KEY='JASMINA_SECRET_2026'.
   - [x] proxy.ts: Add `authorize` middleware to POST '/'.
   - [x] index.ts: Added `/proxy` mount.
   - Test: Backend dev server.

### 2. Frontend Auth Fixes [COMPLETED ✅]
   - [x] axios.js: Fix header to `Bearer ` (lowercase B).
   - [x] Sidebar.jsx: Convert Profile link to dropdown toggle (fetch /api/auth/me, glassmorphism UI).

### 3. Profile Dropdown Impl [COMPLETED ✅]
   - [x] ProfileView.jsx: Integrate real user data (username/role), AuthContext.logout.
   - Test: Profile icon click shows User/Role/Logout.

### 4. ModernDashboard - Proxy View & Playground [COMPLETED ✅]
   - [x] Install react-syntax-highlighter.
   - [x] Create utils/translator.js.
   - [x] ModernDashboard.jsx: Full UI (playground left, proxy response right w/ translator).

### 5. Cleanup & Single Playground [COMPLETED ✅]
   - [x] ApiTester.jsx: Redirect to /pro.
   - [x] App.jsx: Routes clean (protected routes).

### 6. Testing & Demo [PENDING ⏳]
   - Backend: `cd main-backend-code && npm run dev`
   - Frontend: `cd main-frontend-code && npm run dev`
   - Test: Profile dropdown, proxy external API (e.g., jsonplaceholder), syntax highlight JSON/HTML.

## Progress Tracking
- Current: Creating TODO.md ✅
- Next: Backend step 1.

Updated after each step.
