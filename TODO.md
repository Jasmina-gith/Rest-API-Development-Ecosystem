# TODO: REPAIR 404 WIKI AND NAVIGATION FIXES

## Steps:
- [x] Step 1: Edit App.jsx (wrap BrowserRouter, add /learn route, fix / to LoginPage)
- [x] Step 2: Edit NotFound.jsx (replace Link with hard-redirect button "Return to Secure Gateway")
- [x] Step 3: Edit APIWiki.jsx (add "Return to Dashboard" header button, ensure #020617 Dark Slate theme with border-slate-800)
- [x] Step 4: Test navigation: Run `cd main-frontend-code && npm run dev`, check /, /learn, /pro, invalid path -> 404 button
- [x] Step 5: Optional cleanup: Scan/replace stray Link components outside Router (no stray Links found in core files)

Progress will be updated after each step.
