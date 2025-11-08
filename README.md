<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/16HCQUfRMItTpfH-yRnJ4b06boI6OlaR2

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Create `.env.local` with the required keys (see `Docs/GOOGLE_SETUP.md` for setup steps):
   ```
   GEMINI_API_KEY=your-ai-studio-or-vertex-gemini-key
   VITE_GOOGLE_MAPS_API_KEY=your-google-maps-platform-key
   ```
3. Run the app:
   `npm run dev`
