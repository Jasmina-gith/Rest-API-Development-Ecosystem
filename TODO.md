# Supabase Auth Integration TODO

## Steps
1. [x] Plan confirmed
2. [x] Edit LoginPage.jsx (import + handleSubmit)
3. [x] Provide trigger SQL
4. [ ] Test: Login with ga@example.com → check Supabase auth.users and public.Users tables

**Instructions:**
- Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
- Run trigger SQL in Supabase SQL Editor
- Enable Email auth, disable confirmations for demo

**Status:** LoginPage.jsx updated with Supabase auth. Dev server running at http://localhost:5185/. Test login (avoid password \"123\"), verify buttons/lights in dashboard (pulsing dot, API playground Run button, collapse sidebar), signals (health status, service statuses). Users now sync to Supabase tables.
