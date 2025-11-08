# Google Cloud Setup Guide

This project now keeps AI (Gemini) and deterministic location search (Google Maps Places/Geocoding) separate. Follow the steps below to provision keys safely in a dedicated Google Cloud project.

## 1. Create/Select a Google Cloud Project
1. Sign in to https://console.cloud.google.com/ and click the project picker.
2. Create a new project (recommended: name it `whowhe2wha`), or select an existing sandbox.
3. Attach a billing account. Every Maps project receives a $200 monthly credit, which is usually enough for prototype usage.

## 2. Enable Google Maps Platform Services
1. In the selected project, open **APIs & Services → Library**.
2. Enable these APIs:
   - *Maps JavaScript API*
   - *Places API*
   - *Geocoding API*
3. Go to **APIs & Services → Credentials → + Create Credentials → API key**.
4. Configure the key:
   - **Application restrictions:** choose *HTTP referrers* and add:
     - `http://localhost:3000/*`
     - your production hostname (e.g., `https://<username>.github.io/whowhe2wha/*`)
   - **API restrictions:** limit the key to the three APIs above.
5. Copy the key; you will paste it into `VITE_GOOGLE_MAPS_API_KEY`.

The deterministic Add Location modal uses Places Autocomplete + Place Details and optionally Geocoding. Expect ~$0.017 per autocomplete session / details call and ~$0.005 per geocode, all covered by the $200 free credit for most MVP scenarios.

## 3. Generate a Gemini API Key (AI Studio)
1. Visit https://aistudio.google.com/app/apikey and click **Create API key**.
2. Copy the key into `GEMINI_API_KEY` in `.env.local`.
3. This key powers `services/geminiService.ts` (querying the context graph). If you don’t need AI search yet, you can leave the value blank and the UI will fall back to keyword filtering.

## 4. Optional: Vertex AI Credentials via `gcloud`
Use Vertex if you need higher quotas or enterprise IAM boundaries.
1. Install the Google Cloud SDK: https://cloud.google.com/sdk/docs/install
2. Initialize and select the project:
   ```bash
   gcloud init
   gcloud config set project <PROJECT_ID>
   ```
3. Authenticate for Application Default Credentials so SDKs can call Vertex without embedding keys:
   ```bash
   gcloud auth application-default login
   ```
   This stores credentials in `~/.config/gcloud/application_default_credentials.json` and sets `GOOGLE_APPLICATION_CREDENTIALS` automatically.
4. Alternatively, create a dedicated service account with the **Vertex AI User** role and run:
   ```bash
   gcloud iam service-accounts keys create key.json \
     --iam-account=<SERVICE_ACCOUNT_EMAIL>
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
   ```
5. When you are ready to move from AI Studio to Vertex, update `services/geminiService.ts` to use the Vertex client while keeping the same `.env` interface.

## 5. Populate `.env.local`
```
GEMINI_API_KEY=ai-studio-or-vertex-key
VITE_GOOGLE_MAPS_API_KEY=maps-platform-key
```
> Never commit this file. Each teammate should create their own `.env.local` with personal keys.

## 6. Verify Locally
1. Run `npm run dev`.
2. Open `http://localhost:3000` and add a location:
   - The search field should show “Powered by Google Places”.
   - Selecting a suggestion populates the official address, coordinates, and preview map.
   - Switching to the manual tab and clicking **Validate address** uses the Geocoding API.
3. Test the Summon/search bar. If the Gemini key is missing or invalid, you’ll see an inline error in the console (`services/geminiService` logs).

## 7. Maintenance & Cleanup
- Rotate keys periodically or immediately if you suspect exposure. Update `.env.local`, restart Vite, and redeploy.
- If usage spikes or a key is abused, disable it in **APIs & Services → Credentials**. Because the app has its own GCP project, production workloads elsewhere stay unaffected.
- Document every key (purpose, creation date, restrictions) so you can revoke confidently when onboarding/offboarding contributors.
