# ActCLI Branding Integration Guide

Step-by-step instructions to apply ActCLI themes to WhoWhe2Wha.

## ⏱️ Estimated Time: 10-15 minutes

## 📋 Prerequisites

- [ ] Pull latest code from Google AI Studio repository
- [ ] Backup current files (or commit current state to git)
- [ ] Node.js installed for testing

## 🔧 Integration Steps

### Step 1: Update CSS Variables (index.html)

**File:** `index.html`

**Action:** Add ActCLI theme CSS variables

1. Open `index.html` in your editor
2. Find the closing of `html.focus` theme (around line 80)
3. **PASTE** the entire contents of `branding-actcli/actcli-themes.css` **AFTER** the `html.focus` block
4. Save the file

**Location in file:**
```html
<style type="text/tailwindcss">
  @layer base {
    :root {
      /* ... existing root theme ... */
    }

    html.light {
      /* ... existing light theme ... */
    }

    html.focus {
      /* ... existing focus theme ... */
    }

    /* ===== PASTE ActCLI THEMES HERE ===== */
    html.actcli {
      /* ... ActCLI dark theme ... */
    }

    html.actcli-light {
      /* ... ActCLI light theme ... */
    }

    html.actcli-nord {
      /* ... ActCLI nord theme ... */
    }

    html.actcli-roundtable {
      /* ... ActCLI round table theme ... */
    }
  }
</style>
```

**Verify:** Check no syntax errors (closing braces, semicolons)

---

### Step 2: Update Type Definition (types.ts)

**File:** `types.ts`

**Action:** Add new theme names to Theme type

1. Open `types.ts`
2. Find line 77: `export type Theme = 'light' | 'dark' | 'focus';`
3. **REPLACE** with:

```typescript
export type Theme =
  | 'light'
  | 'dark'
  | 'focus'
  | 'actcli'
  | 'actcli-light'
  | 'actcli-nord'
  | 'actcli-roundtable';
```

**Verify:** TypeScript compiles without errors

---

### Step 3: Update Theme Switcher (components/ThemeSwitcher.tsx)

**File:** `components/ThemeSwitcher.tsx`

**Option A: Full Replacement (Easiest)**

1. Backup current `ThemeSwitcher.tsx`
2. **REPLACE** entire file with `branding-actcli/ThemeSwitcher.tsx`

**Option B: Manual Update (If you have custom changes)**

1. Open `components/ThemeSwitcher.tsx`
2. Add icon components at top (after imports):

```typescript
const VSCodeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

const NordIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);

const RoundTableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);
```

3. Update themes array (around line 10):

```typescript
const themes: { name: Theme; icon: React.ReactNode; label: string }[] = [
  { name: 'light', icon: <SunIcon />, label: 'Light' },
  { name: 'dark', icon: <MoonIcon />, label: 'Dark' },
  { name: 'focus', icon: <BrainIcon />, label: 'Focus' },
  // NEW ActCLI themes
  { name: 'actcli', icon: <VSCodeIcon />, label: 'ActCLI Dark' },
  { name: 'actcli-light', icon: <SunIcon />, label: 'ActCLI Light' },
  { name: 'actcli-nord', icon: <NordIcon />, label: 'ActCLI Nord' },
  { name: 'actcli-roundtable', icon: <RoundTableIcon />, label: 'ActCLI Round Table' },
];
```

4. Update button title to use label:

```typescript
// Change from:
title={`Switch to ${t.name} theme`}

// To:
title={t.label}
```

**Verify:** Component renders without errors

---

### Step 4: Test Locally

1. Install dependencies (if not already):
```bash
cd /media/alex/LargeStorage/Projects/WhoWhe2Wha
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Open in browser (usually `http://localhost:5173`)

4. **Test each theme:**
   - Click theme switcher
   - Select each ActCLI theme
   - Verify colors change correctly
   - Check all components render properly

**Expected behavior:**
- ✅ Theme switcher shows 7 themes (3 original + 4 ActCLI)
- ✅ Clicking theme button changes colors instantly
- ✅ Selected theme is highlighted
- ✅ Theme persists on page reload (localStorage)

---

### Step 5: Verify Integration

**Checklist:**

- [ ] All 7 themes appear in theme switcher
- [ ] ActCLI Dark theme has VSCode colors (`#1e1e1e` background)
- [ ] ActCLI Light theme has white background
- [ ] ActCLI Nord theme has blue-gray tones
- [ ] ActCLI Round Table theme has distinct model colors
- [ ] Theme switching is smooth (no flash)
- [ ] Theme persists after page reload
- [ ] No console errors
- [ ] All components visible and styled correctly

**Quick Visual Test:**

Each theme should look distinctly different:

| Theme | Background | Accent | Feel |
|-------|-----------|--------|------|
| **ActCLI Dark** | Very dark gray (`#1e1e1e`) | Blue (`#007acc`) | VSCode-like |
| **ActCLI Light** | White (`#ffffff`) | Blue (`#0066cc`) | Clean, bright |
| **ActCLI Nord** | Blue-gray (`#2e3440`) | Cyan (`#88c0d0`) | Cool, professional |
| **Round Table** | Dark (`#1a1a1a`) | Multi-color | Vibrant, playful |

---

## 🐛 Troubleshooting

### Theme Switcher Shows Old Themes Only

**Problem:** New ActCLI themes don't appear

**Solution:**
1. Check `types.ts` includes new theme names
2. Verify `ThemeSwitcher.tsx` has new themes in array
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Colors Don't Change When Selecting Theme

**Problem:** Clicking theme does nothing

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for errors
3. Run: `document.documentElement.className`
   - Should show current theme name
4. Manually set: `document.documentElement.className = 'actcli'`
   - If this works, issue is in ThemeSwitcher logic
   - If this doesn't work, CSS variables not loaded

---

### Wrong Colors Showing

**Problem:** Theme colors look incorrect

**Solution:**
1. Open DevTools → Elements tab
2. Select `<html>` element
3. Check Computed styles for CSS variables
4. Example: `--background-primary` should show `rgb(30, 30, 30)` for ActCLI Dark
5. If wrong values, check `index.html` CSS syntax

---

### TypeScript Errors

**Problem:** `Type '"actcli"' is not assignable to type 'Theme'`

**Solution:**
1. Ensure `types.ts` was updated correctly
2. Restart TypeScript server in VSCode: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Check no typos in theme names (case-sensitive!)

---

### Theme Doesn't Persist on Reload

**Problem:** Theme resets to default after page refresh

**Solution:**
1. Check browser localStorage: `localStorage.getItem('theme')`
2. If null, theme isn't being saved
3. Check `App.tsx` has `localStorage.setItem('theme', newTheme)` in theme setter
4. Try clearing localStorage: `localStorage.clear()` then set theme again

---

## 🔄 Rollback Instructions

If something goes wrong:

1. **Restore from backups:**
```bash
git checkout index.html
git checkout types.ts
git checkout components/ThemeSwitcher.tsx
```

2. **Or manually revert:**
   - Remove ActCLI theme blocks from `index.html`
   - Change `types.ts` back to: `export type Theme = 'light' | 'dark' | 'focus';`
   - Restore original `ThemeSwitcher.tsx` from backup

3. **Restart dev server** and verify original themes work

---

## 📤 Next Steps (Optional)

### Option 1: Keep Local Only
- Use ActCLI themes locally
- Don't commit changes
- Pull AI Studio updates without conflicts

### Option 2: Commit to GitHub
```bash
git add index.html types.ts components/ThemeSwitcher.tsx
git commit -m "feat: Add ActCLI theme pack with VSCode, Nord, and Round Table variants"
git push origin main
```

⚠️ **Warning:** Google AI Studio might overwrite these changes on next sync

### Option 3: Use Separate Branch
```bash
git checkout -b actcli-branding
git add index.html types.ts components/ThemeSwitcher.tsx
git commit -m "feat: Add ActCLI branding themes"
git push origin actcli-branding
```

Merge manually when needed.

---

## 🎨 Customization After Integration

### Change Default Theme

**File:** `App.tsx`

Find theme initialization (usually around `useState`):

```typescript
// Change from:
const [theme, setTheme] = useState<Theme>('dark');

// To:
const [theme, setTheme] = useState<Theme>('actcli');
```

### Adjust Colors

Edit `index.html` CSS variables for any theme:

```css
html.actcli {
  /* Change VSCode blue to custom color */
  --color-wha-blue: 0 150 255; /* lighter blue */
}
```

### Hide Themes

Remove unwanted themes from `ThemeSwitcher.tsx`:

```typescript
const themes = [
  { name: 'light', icon: <SunIcon />, label: 'Light' },
  { name: 'actcli', icon: <VSCodeIcon />, label: 'ActCLI Dark' },
  // Remove others if not needed
];
```

---

## ✅ Success Criteria

Integration is complete when:

1. ✅ Dev server runs without errors
2. ✅ All 7 themes available in theme switcher
3. ✅ Each theme shows distinct colors
4. ✅ Theme switching is instant and smooth
5. ✅ Theme persists after page reload
6. ✅ No TypeScript errors
7. ✅ All components render correctly in all themes

---

## 📞 Need Help?

If you encounter issues not covered here:

1. Check browser console for errors
2. Verify all files saved correctly
3. Compare with original files in `branding-actcli/` directory
4. Try rollback and re-apply step-by-step

---

**Integration Date:** _____________
**Tested Themes:** ☐ ActCLI Dark ☐ ActCLI Light ☐ ActCLI Nord ☐ Round Table
**Status:** ☐ Success ☐ Issues (see troubleshooting) ☐ Rolled back

---

**Created:** November 5, 2025
**Version:** 1.0
**For:** WhoWhe2Wha ActCLI branding integration
