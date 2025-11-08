# ActCLI Branding for WhoWhe2Wha

This directory contains ActCLI-themed color schemes that can be applied to WhoWhe2Wha.

## 📦 What's Included

- **actcli-themes.css** - Complete CSS variable definitions for all ActCLI themes
- **ThemeSwitcher.tsx** - Updated theme switcher component with ActCLI themes
- **types.ts.patch** - Type definition updates for new themes
- **INTEGRATION-GUIDE.md** - Step-by-step integration instructions

## 🎨 Available Themes

### 1. **ActCLI Dark** (`actcli`)
VSCode-inspired dark theme with signature blue accent (`#007acc`)
- Background: `#1e1e1e` (VSCode editor)
- Sidebar: `#252526` (VSCode sidebar)
- Accent: `#007acc` (VSCode blue)

### 2. **ActCLI Light** (`actcli-light`)
Clean light theme matching ActCLI's light mode
- Background: `#ffffff` (white)
- Sidebar: `#f3f3f3` (light gray)
- Accent: `#0066cc` (darker blue)

### 3. **ActCLI Nord** (`actcli-nord`)
Nord Polar Night color palette
- Background: `#2e3440` (Nord darkest)
- Sidebar: `#3b4252` (Nord dark)
- Accent: `#88c0d0` (Nord frost blue)

### 4. **ActCLI Round Table** (`actcli-roundtable`)
Multi-model chat theme with distinct model colors
- Llama: `#ff6b6b` (red)
- Claude: `#4ecdc4` (teal)
- GPT: `#45b7d1` (blue)
- Gemini: `#f59e0b` (amber)

## 🚀 Quick Start

### Option A: Manual Integration (Recommended)

When ready to apply ActCLI branding:

1. Pull latest from Google AI Studio
2. Follow the [INTEGRATION-GUIDE.md](./INTEGRATION-GUIDE.md)
3. Test locally before pushing to GitHub

### Option B: Preview Without Integrating

1. Open `actcli-themes.css` in browser DevTools
2. Paste CSS into browser console as `<style>` tag
3. Change `document.documentElement.className = 'actcli'`
4. See theme instantly without file changes!

## 📋 Integration Checklist

- [ ] Pull latest code from AI Studio
- [ ] Backup current `index.html`, `types.ts`, `ThemeSwitcher.tsx`
- [ ] Apply CSS variables to `index.html`
- [ ] Update `types.ts` with new Theme type
- [ ] Replace `ThemeSwitcher.tsx`
- [ ] Test theme switching locally
- [ ] Commit changes (optional - keep local or push to GitHub)

## 🎯 Design Decisions

### Why CSS Variables?
- ✅ Zero JavaScript overhead
- ✅ Instant theme switching
- ✅ Works with Tailwind's utility classes
- ✅ Easy to customize per-theme

### Why Separate Directory?
- ✅ Google AI Studio won't overwrite these files
- ✅ Can pull latest AI Studio changes without conflicts
- ✅ Apply branding when ready
- ✅ Keep branding separate from AI-generated code

### Color Mapping Strategy

ActCLI uses semantic colors that map to WhoWhe2Wha's existing variables:

| ActCLI Semantic | Hex | WhoWhe2Wha Variable |
|----------------|-----|---------------------|
| VSCode Blue | `#007acc` | `--color-wha-blue` |
| Success Green | `#48bb78` | `--color-where-green` |
| Warning Amber | `#FFC107` | `--color-to-orange` |
| Error Red | `#f56565` | `--color-who-pink` |

## 🔧 Customization

To create your own theme variant:

1. Copy an existing theme block from `actcli-themes.css`
2. Rename `html.actcli` to `html.your-theme-name`
3. Adjust color values (keep RGB format: `R G B`)
4. Add to `types.ts`: `| 'your-theme-name'`
5. Add to `ThemeSwitcher.tsx` themes array

Example:

```css
html.my-custom-theme {
  --color-primary: 255 255 255;
  --background-primary: 0 0 0;
  /* ... other variables */
}
```

## 📊 Color Reference

### RGB Format Conversion

CSS variables use space-separated RGB values for Tailwind compatibility:

```
Hex: #007acc
RGB: rgb(0, 122, 204)
CSS Variable: 0 122 204
```

### ActCLI Color Palette

```
VSCode Dark:
  Editor BG: #1e1e1e (30 30 30)
  Sidebar BG: #252526 (37 37 38)
  Status Bar: #007acc (0 122 204)
  Input BG: #3c3c3c (60 60 60)

Semantic Colors:
  Success: #48bb78 (72 187 120)
  Warning: #FFC107 (255 193 7)
  Error: #f56565 (245 101 101)
  Info: #007acc (0 122 204)

Nord Palette:
  Polar Night 0: #2e3440 (46 52 64)
  Polar Night 1: #3b4252 (59 66 82)
  Polar Night 2: #434c5e (67 76 94)
  Snow Storm: #d8dee9 (216 222 233)
  Frost: #88c0d0 (136 192 208)
  Aurora Green: #a3be8c (163 190 140)
  Aurora Yellow: #ebcb8b (235 203 139)
  Aurora Red: #bf616a (191 97 106)
```

## 🐛 Troubleshooting

### Theme not applying?
- Check `document.documentElement.className` in DevTools
- Verify CSS variables are defined in `<style>` tag
- Ensure theme name matches exactly (case-sensitive)

### Colors look wrong?
- Check RGB values are space-separated (not comma-separated)
- Verify Tailwind config uses `<alpha-value>` syntax
- Test with browser DevTools computed styles

### Theme switcher not showing new themes?
- Check `types.ts` includes new theme names
- Verify `ThemeSwitcher.tsx` has new themes in array
- Clear browser cache and rebuild

## 📝 Notes for AI Studio Workflow

1. **DO NOT** commit these files to GitHub initially
2. Work on features in AI Studio normally
3. When ready for branding:
   - Pull latest from AI Studio
   - Apply branding locally
   - Test thoroughly
   - Optionally push to separate branch

This keeps your AI Studio workflow clean while preserving branding options.

## 🔗 Related Files

Main app files that reference themes:
- `index.html` - CSS variable definitions
- `types.ts` - Theme type definition
- `components/ThemeSwitcher.tsx` - Theme selection UI
- `App.tsx` - Theme state management

## 📧 Support

If you encounter issues:
1. Check DevTools console for errors
2. Verify all files are in sync
3. Test with default themes first
4. Compare with original files in Git

---

**Created:** November 5, 2025
**For:** ActCLI branding integration
**Status:** Ready to integrate (not yet applied)
