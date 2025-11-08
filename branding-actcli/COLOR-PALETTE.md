# ActCLI Color Palette Reference

Quick reference for all ActCLI theme colors used in WhoWhe2Wha.

## 🎨 ActCLI Dark Theme (Default)

Based on VSCode Dark+ theme.

### Backgrounds
```css
Editor Background:     #1e1e1e  rgb(30, 30, 30)    ███████
Sidebar Background:    #252526  rgb(37, 37, 38)    ██████░
Input Background:      #3c3c3c  rgb(60, 60, 60)    █████░░
Modal Overlay:         #1e1e1e  rgb(30, 30, 30)    ███████ @ 90% opacity
```

### Text Colors
```css
Primary Text:          #cccccc  rgb(204, 204, 204) ░░░░░░░
Secondary Text:        #888888  rgb(136, 136, 136) ████░░░
Borders/Tertiary:      #444444  rgb(68, 68, 68)    ██████░
```

### Accent Colors
```css
VSCode Blue:           #007acc  rgb(0, 122, 204)   █░░░███  ← Signature color
Success Green:         #48bb78  rgb(72, 187, 120)  █░██░██
Warning Amber:         #ffc107  rgb(255, 193, 7)   ███████
Error Red:             #f56565  rgb(245, 101, 101) ███░░██
```

### Entity Colors (Who/Where/What/To)
```css
Who (Pink/Red):        #f56565  rgb(245, 101, 101) ███░░██
Where (Green):         #48bb78  rgb(72, 187, 120)  █░██░██
What (Blue):           #007acc  rgb(0, 122, 204)   █░░░███
To (Orange):           #ffc107  rgb(255, 193, 7)   ███████
```

---

## ☀️ ActCLI Light Theme

Clean light theme with darker text on white background.

### Backgrounds
```css
Editor Background:     #ffffff  rgb(255, 255, 255) ░░░░░░░
Sidebar Background:    #f3f3f3  rgb(243, 243, 243) ░░░░░░█
Input Background:      #ffffff  rgb(255, 255, 255) ░░░░░░░
Modal Overlay:         #ffffff  rgb(255, 255, 255) ░░░░░░░ @ 90% opacity
```

### Text Colors
```css
Primary Text:          #333333  rgb(51, 51, 51)    ███████
Secondary Text:        #757575  rgb(117, 117, 117) ████░░░
Borders/Tertiary:      #e6e6e6  rgb(230, 230, 230) ░░░░░░█
```

### Accent Colors (Darker for Contrast)
```css
VSCode Blue:           #0066cc  rgb(0, 102, 204)   █░░░███
Success Green:         #16a34a  rgb(22, 163, 74)   ██░██░█
Warning Amber:         #d97706  rgb(217, 119, 6)   ███░░░█
Error Red:             #dc2626  rgb(220, 38, 38)   ███░░██
```

---

## ❄️ ActCLI Nord Theme

Based on Nord color palette (Polar Night + Aurora).

### Backgrounds (Polar Night)
```css
Editor Background:     #2e3440  rgb(46, 52, 64)    ████░██
Sidebar Background:    #3b4252  rgb(59, 66, 82)    ████░██
Input Background:      #434c5e  rgb(67, 76, 94)    ████░██
Modal Overlay:         #2e3440  rgb(46, 52, 64)    ████░██ @ 90% opacity
```

### Text Colors (Snow Storm + Frost)
```css
Primary Text:          #d8dee9  rgb(216, 222, 233) ░░░░░░█
Secondary Text:        #8fbcbb  rgb(143, 188, 187) ░█░░░░█
Borders/Tertiary:      #434c5e  rgb(67, 76, 94)    ████░██
```

### Accent Colors (Aurora)
```css
Nord Blue:             #88c0d0  rgb(136, 192, 208) ░█░░░░█
Nord Green:            #a3be8c  rgb(163, 190, 140) ░█░░░█░
Nord Yellow:           #ebcb8b  rgb(235, 203, 139) ░░░░░░█
Nord Red:              #bf616a  rgb(191, 97, 106)  ███░░██
```

### Entity Colors (Nord Aurora)
```css
Who (Red):             #bf616a  rgb(191, 97, 106)  ███░░██
Where (Green):         #a3be8c  rgb(163, 190, 140) ░█░░░█░
What (Blue):           #88c0d0  rgb(136, 192, 208) ░█░░░░█
To (Yellow):           #ebcb8b  rgb(235, 203, 139) ░░░░░░█
```

---

## 🎭 ActCLI Round Table Theme

Multi-model chat theme with vibrant model-specific colors.

### Backgrounds
```css
Editor Background:     #1a1a1a  rgb(26, 26, 26)    ███████
Sidebar Background:    #2d3748  rgb(45, 55, 72)    ████░██
Input Background:      #4a5568  rgb(74, 85, 104)   ████░██
Modal Overlay:         #1a1a1a  rgb(26, 26, 26)    ███████ @ 90% opacity
```

### Text Colors
```css
Primary Text:          #cccccc  rgb(204, 204, 204) ░░░░░░░
Secondary Text:        #9ca3af  rgb(156, 163, 175) ░█░░░░█
Borders/Tertiary:      #4b5563  rgb(75, 85, 99)    ████░██
```

### Model Colors (Entity Colors)
```css
Llama Red (Who):       #ff6b6b  rgb(255, 107, 107) ███░░██
Claude Teal (Where):   #4ecdc4  rgb(78, 205, 196)  ░█░░░░█
GPT Blue (What):       #45b7d1  rgb(69, 183, 209)  ░█░░░░█
Gemini Amber (To):     #f59e0b  rgb(245, 158, 11)  ███░░░█
```

### Status Colors
```css
Active/Success:        #48bb78  rgb(72, 187, 120)  █░██░██
Completed:             #4299e1  rgb(66, 153, 225)  ░█░░░░█
On Hold/Warning:       #ed8936  rgb(237, 137, 54)  ███░░░█
```

---

## 🔄 Color Conversion Reference

### Converting Between Formats

**Hex → RGB:**
```
#007acc
→ Split into pairs: 00, 7a, cc
→ Convert to decimal: 0, 122, 204
→ RGB: rgb(0, 122, 204)
```

**RGB → CSS Variable (Tailwind):**
```
rgb(0, 122, 204)
→ Remove commas, keep spaces: 0 122 204
→ CSS: var(--color-wha-blue)
```

**Using in Tailwind:**
```html
<!-- Direct usage -->
<div class="bg-[rgb(0,122,204)]">

<!-- Via CSS variable -->
<div class="bg-wha-blue">

<!-- With opacity -->
<div class="bg-wha-blue/50">
```

---

## 📊 Semantic Color Mapping

How ActCLI semantic colors map to WhoWhe2Wha variables:

| ActCLI Semantic | Hex | WhoWhe2Wha Variable | Usage |
|----------------|-----|---------------------|-------|
| **Backgrounds** |
| Editor BG | `#1e1e1e` | `--background-primary` | Main app background |
| Sidebar BG | `#252526` | `--background-secondary` | Cards, panels |
| Input BG | `#3c3c3c` | `--background-input` | Form inputs |
| **Text** |
| Primary Text | `#cccccc` | `--color-primary` | Main content text |
| Secondary Text | `#888888` | `--color-secondary` | Labels, hints |
| Borders | `#444444` | `--color-tertiary` | Dividers, borders |
| **Status** |
| Success | `#48bb78` | `--color-status-active` | Active items |
| Info | `#007acc` | `--color-status-completed` | Completed items |
| Warning | `#FFC107` | `--color-status-onhold` | On hold items |
| Error | `#f56565` | `--color-who-pink` | Errors, alerts |
| **Entities** |
| Who | `#f56565` | `--color-who-pink` | Person tags |
| Where | `#48bb78` | `--color-where-green` | Location tags |
| What | `#007acc` | `--color-wha-blue` | Event tags |
| To | `#FFC107` | `--color-to-orange` | Time tags |

---

## 🎯 Usage Examples

### In CSS
```css
/* Using CSS variables */
.custom-element {
  background-color: rgb(var(--background-primary));
  color: rgb(var(--color-primary));
  border: 1px solid rgb(var(--color-tertiary));
}
```

### In Tailwind HTML
```html
<!-- Using Tailwind utility classes -->
<div class="bg-primary text-primary border border-tertiary">
  <span class="text-wha-blue">What</span>
  <span class="text-where-green">Where</span>
</div>
```

### In JavaScript/TypeScript
```typescript
// Get computed color value
const primaryBg = getComputedStyle(document.documentElement)
  .getPropertyValue('--background-primary');
// Returns: "30 30 30"

// Set theme programmatically
document.documentElement.className = 'actcli';
```

---

## 🧪 Testing Colors

### Browser DevTools Method

1. Open DevTools (F12)
2. Go to Elements tab
3. Select `<html>` element
4. In Computed tab, search for `--background-primary`
5. Verify value matches expected RGB

### Visual Test Patterns

Use these to verify themes render correctly:

```html
<!-- Color test grid -->
<div class="grid grid-cols-4 gap-4">
  <div class="bg-who-pink p-4 text-white">Who</div>
  <div class="bg-where-green p-4 text-white">Where</div>
  <div class="bg-wha-blue p-4 text-white">What</div>
  <div class="bg-to-orange p-4 text-white">To</div>
</div>
```

---

## 📝 Customization Tips

### Creating Theme Variants

1. Copy existing theme block
2. Rename `html.actcli` to `html.my-theme`
3. Adjust color values (keep RGB format)
4. Add to types.ts and ThemeSwitcher

### Fine-tuning Colors

For better readability:
- **Dark themes:** Increase text contrast (lighter text on dark BG)
- **Light themes:** Ensure sufficient contrast ratio (WCAG AA: 4.5:1)
- **Accents:** Use distinct hues for different entity types

### Accessibility

Minimum contrast ratios (WCAG 2.1):
- **Normal text:** 4.5:1
- **Large text (18pt+):** 3:1
- **UI components:** 3:1

Test with: Chrome DevTools → Lighthouse → Accessibility

---

**Created:** November 5, 2025
**For:** ActCLI branding in WhoWhe2Wha
**Last Updated:** November 5, 2025
