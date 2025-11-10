# Google Cloud Platform - Complete Guide

**Comprehensive guide to Google Cloud services, hierarchy, and pricing**

**Created:** 2025-11-09
**Last Updated:** 2025-11-09

---

## Table of Contents

1. [Google Services Ecosystem Overview](#google-services-ecosystem-overview)
2. [Google AI APIs - The Confusion](#google-ai-apis---the-confusion)
3. [Three Ways to Access Google AI](#three-ways-to-access-google-ai)
4. [Google Maps Platform APIs](#google-maps-platform-apis)
5. [GCP Resource Hierarchy](#gcp-resource-hierarchy)
6. [Billing Structure](#billing-structure)
7. [Complete Example Structure](#complete-example-structure)
8. [Pricing Summary](#pricing-summary)
9. [Decision Matrices](#decision-matrices)
10. [Common Gotchas](#common-gotchas)

---

## Google Services Ecosystem Overview

Google has several different service ecosystems that often confuse users:

### **1. Google Cloud Platform (GCP)** - Infrastructure/Developer services
- Compute Engine (VMs)
- Cloud Storage
- Cloud SQL
- Kubernetes Engine (GKE)
- Cloud Run
- BigQuery
- **Vertex AI** (Enterprise ML platform)
- etc.

### **2. Google Workspace** - Business productivity
- Gmail for business
- Google Drive (business)
- Docs, Sheets, Slides
- Meet, Calendar
- Admin console

### **3. Consumer Google Services** - Free/personal
- Gmail (free)
- Google Drive (free tier)
- Google Photos
- Google One (paid storage)

### **4. Firebase** - Mobile/web app platform
- Hosting
- Authentication
- Firestore database
- Cloud Functions

### **5. Google Maps Platform** - Mapping & Location services
- Maps JavaScript API
- Places API
- Geocoding API
- Directions API

### **6. Google AI Studio / Gemini API** - Direct AI access
- Simplified API access to Gemini models
- Developer-friendly
- Generous free tier

---

## Google AI APIs - The Confusion

Google has **multiple ways** to access the same AI models, with different pricing and features.

### **Google's AI Models:**
- **Gemini 2.0 Flash** - Newest, fastest
- **Gemini 1.5 Pro** - Most capable, multimodal (text/image/video/audio)
- **Gemini 1.5 Flash** - Faster, cheaper, good for most tasks
- **Gemini 1.0 Pro** - Older, being phased out
- **PaLM 2** - Older generation, legacy

---

## Three Ways to Access Google AI

### **1. Google AI Studio / Gemini API** (Simplest, Free Tier)

**What it is:**
- Direct API access to Gemini models
- Simplified, developer-friendly
- Google's "competitor" to OpenAI API

**Endpoint:** `generativelanguage.googleapis.com`

#### **Pricing (as of 2025):**

**Free Tier (Generous!):**

**Gemini 1.5 Flash:**
- 15 requests/minute (RPM)
- 1 million tokens/minute (TPM)
- 1,500 requests/day (RPD)
- **FREE!** No credit card needed

**Gemini 1.5 Pro:**
- 2 RPM
- 32,000 TPM
- 50 RPD
- **FREE!**

**Paid Tier (Pay-as-you-go):**

**Gemini 1.5 Flash:**
- Input: $0.075 per 1M tokens (up to 128k context)
- Output: $0.30 per 1M tokens
- 1000 RPM, 4M TPM

**Gemini 1.5 Pro:**
- Input: $1.25 per 1M tokens (up to 128k context)
- Output: $5.00 per 1M tokens
- Longer context = more expensive

#### **Best for:**
- ✅ Prototyping
- ✅ Small projects
- ✅ Learning/experimentation
- ✅ Generous free tier!

#### **Limitations:**
- ⚠️ Less enterprise features
- ⚠️ Lower rate limits on free tier
- ⚠️ No fine-tuning
- ⚠️ Less control over deployment

---

### **2. Vertex AI** (Enterprise, Complex, Powerful)

**What it is:**
- Google Cloud Platform's ML platform
- Same models as Gemini API, but with MORE features
- Enterprise-grade with SLAs, security, etc.
- Integrated with GCP ecosystem

**Endpoint:** `{region}-aiplatform.googleapis.com`

#### **Pricing (More Complex!):**

**Gemini 1.5 Flash:**
- **Input:** $0.075 per 1M tokens (≤128k context)
- **Output:** $0.30 per 1M tokens
- **Prompt caching:** $0.01875 per 1M tokens (75% discount!)

**Gemini 1.5 Pro:**
- **Input:** $1.25 per 1M tokens (≤128k context)
- **Output:** $5.00 per 1M tokens
- **Long context (>128k):** Much more expensive
  - 128k-1M tokens: $2.50 input / $10 output

**Free Tier:**
- **NONE!** - You pay from first token
- But there's **$300 free credit** for new GCP accounts (90 days)

#### **Additional Features/Costs:**
- **Model tuning:** Extra cost
- **Grounding with Google Search:** $35 per 1,000 grounding requests
- **RAG (Retrieval):** Additional fees
- **Batch prediction:** Different pricing
- **Model Garden:** Access to other models (Llama, Claude via API)

#### **Best for:**
- ✅ Production applications
- ✅ Enterprise deployments
- ✅ Need fine-tuning
- ✅ Need SLAs/support
- ✅ Integration with GCP services
- ✅ Prompt caching (saves money!)

#### **Limitations:**
- ⚠️ No free tier (except $300 credit)
- ⚠️ More complex setup
- ⚠️ Requires GCP billing account

---

### **3. AI Studio (Web UI)** (Testing/Prototyping)

**What it is:**
- Web interface to test Gemini models
- Generate API keys
- No coding needed
- Same backend as Gemini API

**Pricing:**
- Same as Gemini API (free tier available!)
- Just a UI wrapper

**Best for:**
- ✅ Testing prompts
- ✅ No-code experimentation
- ✅ Generating API keys

---

### **Key Differences: Gemini API vs Vertex AI**

| Feature | Gemini API | Vertex AI |
|---------|------------|-----------|
| **Free Tier** | ✅ YES (generous!) | ❌ NO (but $300 credit) |
| **Pricing** | Simple, pay-as-you-go | Complex, many options |
| **Setup** | Easy, API key | Complex, GCP project |
| **Rate Limits** | Lower (free tier) | Higher (paid) |
| **Enterprise Features** | ❌ Limited | ✅ Full (SLAs, VPC, etc.) |
| **Fine-tuning** | ❌ No | ✅ Yes |
| **Prompt Caching** | ❌ No | ✅ Yes (75% discount!) |
| **Grounding** | ❌ No | ✅ Yes (Google Search) |
| **Model Garden** | ❌ No | ✅ Yes (Llama, Claude, etc.) |
| **Best for** | Prototypes, small apps | Production, enterprise |

---

## Google Maps Platform APIs

Completely separate from AI! Different billing, different hierarchy.

### **Maps API Services:**

1. **Maps JavaScript API** - Interactive maps on websites
2. **Maps Static API** - Static map images
3. **Maps Embed API** - Embed maps (free!)
4. **Directions API** - Route calculations
5. **Distance Matrix API** - Travel time/distance between points
6. **Geocoding API** - Address ↔ coordinates
7. **Geolocation API** - Device location
8. **Places API** - Business/POI search
9. **Roads API** - Snap to roads, speed limits
10. **Street View API** - Street View imagery

### **Places API Specifically:**

**What it does:**
- Search for places (restaurants, gas stations, etc.)
- Get place details (hours, reviews, photos)
- Autocomplete addresses/places
- Nearby search

#### **Pricing (Complex!):**

**Places API has multiple SKUs:**

**Basic Data:**
- Place Search (Find Place): $17 per 1,000 requests
- Nearby Search: $32 per 1,000 requests
- Text Search: $32 per 1,000 requests

**Place Details:**
- Basic: $17 per 1,000 requests
- Contact: $3 per 1,000 requests
- Atmosphere: $5 per 1,000 requests

**Autocomplete:**
- Per-session: $2.83 per 1,000 sessions
- Per-request: $2.83 per 1,000 requests

**Photos:**
- $7 per 1,000 requests

**Free Tier:**
- **$200/month credit** for all Google Maps Platform APIs
- Applies to all Maps APIs (not just one)
- If you go over $200, you pay

**Example:**
```
Monthly usage:
- 5,000 Place Search requests = $85
- 3,000 Place Details requests = $51
- 10,000 Autocomplete sessions = $28.30

Total: $164.30/month
After $200 credit: $0 (still under free tier!)
```

### **Geocoding API vs Places API:**

**Geocoding API:** Address → coordinates (or reverse)
- "123 Main St" → (lat: 40.7, lng: -74.0)

**Places API:** Search for businesses/POI
- "Coffee shops near me" → List of cafes with details

Different pricing, different use cases!

---

## GCP Resource Hierarchy

### **Vertical Structure (Top to Bottom):**

```
Organization (Root Node)
  │
  ├── Folder (optional, for grouping)
  │     │
  │     ├── Sub-Folder (can nest multiple levels)
  │     │     │
  │     │     └── Project
  │     │           │
  │     │           └── Resources/Services
  │     │                 ├── Compute Engine (VMs)
  │     │                 ├── Cloud Storage (buckets)
  │     │                 ├── Vertex AI (models)
  │     │                 ├── Maps API
  │     │                 └── etc.
  │     │
  │     └── Project (can be directly under folder)
  │           └── Resources/Services
  │
  └── Project (can be directly under org, no folder needed)
        └── Resources/Services
```

### **Horizontal Structure (Billing):**

```
Billing Account (separate entity)
  │
  ├── Linked to → Project 1
  ├── Linked to → Project 2
  ├── Linked to → Project 3
  └── Linked to → Project N
```

---

## Breaking Down Each Level

### **1. Organization** (Root Level)

**What it is:**
- Top-level container for ALL your GCP resources
- Tied to your **Google Workspace** or **Cloud Identity** domain
- Example: "mycompany.com" organization

**Who has it:**
- Companies with Google Workspace (formerly G Suite)
- Companies with Cloud Identity
- **Individual users DON'T have organizations** (just projects)

**Purpose:**
- Centralized control
- Organization-wide policies
- Billing management
- IAM inheritance

**Example:**
```
Organization: acme-corp.com
  ├── Super Admin: admin@acme-corp.com
  ├── Org-wide policies (who can create projects, etc.)
  └── Contains all folders/projects
```

---

### **2. Folders** (Grouping/Structure)

**What it is:**
- Optional grouping mechanism
- Can nest (folders within folders)
- Like file system folders

**Purpose:**
- Organize by: department, team, environment, etc.
- Apply policies to multiple projects at once
- Delegation of admin rights

**Example structure:**
```
Organization: acme-corp.com
  │
  ├── Folder: "Production"
  │     ├── Project: prod-frontend
  │     ├── Project: prod-backend
  │     └── Project: prod-database
  │
  ├── Folder: "Development"
  │     ├── Folder: "Team-A"
  │     │     ├── Project: teamA-dev
  │     │     └── Project: teamA-staging
  │     └── Folder: "Team-B"
  │           └── Project: teamB-dev
  │
  └── Folder: "Shared-Services"
        ├── Project: logging
        └── Project: monitoring
```

**Common patterns:**
- By environment: Production / Staging / Development
- By department: Engineering / Marketing / Finance
- By team: Team-A / Team-B / Team-C
- By region: US / EU / Asia

**Can you skip folders?**
- ✅ YES! Projects can be directly under Organization
- Folders are optional organizational tool

---

### **3. Projects** (Where Work Happens)

**What it is:**
- **THE FUNDAMENTAL UNIT** in GCP
- All resources belong to a project
- Has unique Project ID (globally unique, immutable)
- Has Project Name (friendly name, can change)
- Has Project Number (internal GCP identifier)

**Purpose:**
- Contains all your actual resources (VMs, APIs, storage, etc.)
- Billing unit (each project linked to a billing account)
- IAM boundary (permissions scoped to project)
- Resource quota limits
- API enablement (enable APIs per project)

**Example:**
```
Project: "my-ai-app-prod"
  ├── Project ID: my-ai-app-prod-2025
  ├── Project Number: 123456789012
  ├── Billing Account: linked to "Main Billing Account"
  │
  └── Enabled APIs & Resources:
        ├── Vertex AI API (enabled)
        ├── Maps API (enabled)
        ├── Cloud Storage buckets:
        │     ├── my-app-data
        │     └── my-app-backups
        ├── Compute Engine VMs:
        │     ├── web-server-1
        │     └── web-server-2
        └── Vertex AI models:
              └── gemini-1.5-flash
```

**Every project has:**
- ✅ Unique Project ID (permanent)
- ✅ Billing account link (required for paid resources)
- ✅ Enabled APIs (must enable before use)
- ✅ IAM permissions (who can access what)
- ✅ Resource quotas (limits on VMs, API calls, etc.)

---

### **4. Resources/Services** (Actual Cloud Resources)

**What it is:**
- The actual "stuff" you use
- VMs, databases, storage buckets, APIs, etc.
- **ALWAYS belongs to a project**

**Examples:**
- Compute Engine VM instance
- Cloud Storage bucket
- Vertex AI model endpoint
- Maps API calls
- Cloud SQL database
- Cloud Function

**Identification:**
```
Full resource name:
projects/PROJECT_ID/locations/LOCATION/resources/RESOURCE_ID

Example:
projects/my-ai-app/locations/us-central1/models/my-gemini-model
```

---

## Billing Structure

### **Billing Accounts** (Separate from hierarchy)

**What it is:**
- Payment method container
- Linked TO projects (not contained BY them)
- One billing account can serve MANY projects
- Separate from organizational hierarchy

**Structure:**
```
Billing Account: "Main Company Card"
  ├── Payment method: Credit card ending in 1234
  ├── Billing admins: finance@company.com
  │
  └── Linked Projects:
        ├── Project A (charged here)
        ├── Project B (charged here)
        ├── Project C (charged here)
        └── Project D (charged here)

Billing Account: "R&D Budget Card"
  ├── Payment method: Different credit card
  │
  └── Linked Projects:
        ├── Project X (charged here)
        └── Project Y (charged here)
```

### **Key Points:**

**1. One Project = One Billing Account**
- Each project linked to exactly ONE billing account
- Can't split a project's costs across multiple billing accounts

**2. One Billing Account = Many Projects**
- Single billing account can serve unlimited projects
- All charges aggregate to one bill

**3. Billing ≠ Organization Hierarchy**
- Billing account is LINKED to projects
- Not part of the folder/project tree
- Can have billing account without organization

**4. Who can link billing?**
- Billing Account User (can link to projects)
- Billing Account Admin (full billing control)
- Project Owner (can link their project)

---

## Complete Example Structure

```
┌─────────────────────────────────────────────────────────┐
│ Organization: acme-corp.com                             │
│ (Owned by: admin@acme-corp.com)                         │
└─────────────────────────────────────────────────────────┘
          │
          ├── Folder: "Production"
          │     │
          │     ├── Project: prod-web-frontend
          │     │     ├── Billing: → Main Company Billing
          │     │     └── Resources:
          │     │           ├── Compute Engine: 3 VMs
          │     │           ├── Cloud Storage: 2 buckets
          │     │           └── Cloud CDN
          │     │
          │     └── Project: prod-ai-backend
          │           ├── Billing: → Main Company Billing
          │           └── Resources:
          │                 ├── Vertex AI: Gemini endpoints
          │                 ├── Cloud SQL: PostgreSQL
          │                 └── Cloud Functions: 10 functions
          │
          ├── Folder: "Development"
          │     │
          │     └── Project: dev-testing
          │           ├── Billing: → R&D Billing Account
          │           └── Resources:
          │                 ├── Vertex AI: Test models
          │                 └── Cloud Storage: Test data
          │
          └── Project: shared-logging (no folder, directly under org)
                ├── Billing: → Main Company Billing
                └── Resources:
                      └── Cloud Logging & Monitoring

┌─────────────────────────────────────────────────────────┐
│ Billing Account: "Main Company Billing"                 │
│ Payment: **** **** **** 1234                            │
├─────────────────────────────────────────────────────────┤
│ Linked Projects:                                        │
│   ├── prod-web-frontend ($500/mo)                       │
│   ├── prod-ai-backend ($1,200/mo)                       │
│   └── shared-logging ($50/mo)                           │
│ TOTAL: $1,750/month                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Billing Account: "R&D Billing Account"                  │
│ Payment: **** **** **** 5678                            │
├─────────────────────────────────────────────────────────┤
│ Linked Projects:                                        │
│   └── dev-testing ($120/mo)                             │
│ TOTAL: $120/month                                       │
└─────────────────────────────────────────────────────────┘
```

---

## How Permissions Flow (IAM Inheritance)

**Top-down inheritance:**

```
Organization IAM: viewer@company.com = Viewer
  ↓ (inherits down)
Folder IAM: (inherits org permissions)
  ↓ (inherits down)
Project IAM: dev@company.com = Editor (ADDS permission)
  ↓ (inherits down)
Resources: (inherit project permissions)

Result:
  - viewer@company.com can VIEW everything in org
  - dev@company.com can EDIT this specific project
```

**Key points:**
- Permissions grant at higher level = apply to everything below
- Can ADD permissions at lower levels
- Can't REMOVE permissions granted higher up (use deny policies for that)

---

## Billing Flow Diagram

```
You use resources in Project A
           ↓
Project A is linked to → Billing Account #1
           ↓
Charges accumulate in Billing Account #1
           ↓
Monthly bill generated for Billing Account #1
           ↓
Charged to payment method on Billing Account #1
```

**Important:**
- Costs are tracked PER PROJECT
- But billed PER BILLING ACCOUNT
- Bill shows breakdown by project

**Example bill:**
```
Billing Account: Main Company Billing
Month: January 2025
Total: $1,750

Breakdown:
  Project: prod-web-frontend
    - Compute Engine: $300
    - Cloud Storage: $150
    - CDN: $50
    Subtotal: $500

  Project: prod-ai-backend
    - Vertex AI: $800
    - Cloud SQL: $250
    - Cloud Functions: $150
    Subtotal: $1,200

  Project: shared-logging
    - Cloud Logging: $50
    Subtotal: $50
```

---

## Individual Users vs Organizations

### **Individual Developer (No Organization):**

```
You (personal Google account)
  │
  └── Project: my-personal-project
        ├── Billing: → Your credit card
        └── Resources:
              └── Vertex AI, Maps API, etc.

(No organization, no folders, just projects!)
```

**Limitations:**
- ❌ No organization-level policies
- ❌ No folders (can't group projects)
- ❌ Harder to manage at scale
- ✅ But perfectly fine for personal/small projects!

### **Company (With Organization):**

```
Organization: company.com
  ├── Folders (for structure)
  ├── Org-level policies
  ├── Centralized billing
  └── Better permission management
```

**Requires:**
- Google Workspace OR Cloud Identity (free tier available)
- Domain ownership verification

---

## Common Organizational Patterns

### **Pattern 1: By Environment**
```
Organization
  ├── Folder: Production
  │     └── Projects: prod-*
  ├── Folder: Staging
  │     └── Projects: staging-*
  └── Folder: Development
        └── Projects: dev-*
```

### **Pattern 2: By Team**
```
Organization
  ├── Folder: Engineering
  ├── Folder: Data-Science
  └── Folder: Marketing
```

### **Pattern 3: Hybrid**
```
Organization
  ├── Folder: Production
  │     ├── Folder: Frontend-Team
  │     └── Folder: Backend-Team
  └── Folder: Development
        ├── Folder: Frontend-Team
        └── Folder: Backend-Team
```

---

## Pricing Summary

### **AI APIs Pricing:**

**Free/Cheap Development:**
```
Gemini API (Free Tier)
  ↓
Gemini API (Paid) - Still cheap
  ↓
Vertex AI (No free tier, but more features)
```

**When to upgrade:**
- Gemini API free → Paid: When you exceed rate limits
- Gemini API → Vertex: When you need enterprise features/caching

### **Maps APIs Pricing:**

**All Maps APIs share $200/month credit:**
```
$0-200/month: FREE
$200+/month: Pay overage
```

**Cost optimization:**
- Use cached results
- Batch requests
- Use cheaper alternatives (Autocomplete per-session vs per-request)

---

## Decision Matrices

### **For AI (Gemini/Vertex):**

**Starting a new project?**
```
Start with: Gemini API (Free Tier)
  ↓
Reason: Free, generous limits, easy setup
  ↓
Upgrade when:
  - Need more rate limits
  - Need prompt caching (saves $$$)
  - Need enterprise features
  ↓
Upgrade to: Vertex AI
```

**Already in production?**
```
Use: Vertex AI
  ↓
Reason:
  - Prompt caching = 75% savings on repeated content
  - Higher rate limits
  - SLAs
  - Better for scale
```

### **For Maps/Places:**

**Small project (<$200/month)?**
```
Use: Google Maps Platform (any APIs)
  ↓
Stay under $200/month = FREE
```

**Large project (>$200/month)?**
```
Option 1: Optimize usage
  - Cache results
  - Use cheaper API tiers
  - Batch requests

Option 2: Consider alternatives
  - OpenStreetMap (free, open source)
  - Mapbox (different pricing)
  - HERE Maps (different pricing)
```

---

## Cost Calculator Examples

### **Example 1: Small AI chatbot**

**Usage:**
- 10,000 conversations/month
- 500 tokens avg per conversation (input + output)
- Total: 5M tokens/month

**Gemini API (Free Tier):**
- Flash free tier: 1,500 requests/day = 45,000/month
- ✅ **FREE!** (well under limit)

**Gemini API (Paid):**
- 5M tokens × $0.075 (input) + $0.30 (output) mix ≈ $1-2/month

**Vertex AI (Paid):**
- Same cost BUT with caching could be 75% less
- If prompts repeat: ~$0.25-0.50/month

### **Example 2: Location-based app**

**Usage:**
- 20,000 place searches/month
- 10,000 place details/month
- 5,000 autocomplete sessions/month

**Cost:**
```
Place Search: 20,000 × $17/1000 = $340
Place Details: 10,000 × $17/1000 = $170
Autocomplete: 5,000 × $2.83/1000 = $14.15

Total: $524.15/month
Minus $200 credit: $324.15/month you pay
```

**Optimization:**
- Cache place results (reduce API calls)
- Use per-session autocomplete (cheaper)
- Could reduce to ~$200-250/month

---

## Common Gotchas & Confusions

### **1. "Is Vertex AI more expensive than Gemini API?"**

**Per-token pricing is THE SAME!**

But:
- Vertex has NO free tier (but $300 credit for new accounts)
- Vertex has prompt caching (saves 75% on repeated prompts)
- For production with caching, Vertex can be CHEAPER

### **2. "I see 'Generative AI' in Vertex - is that different?"**

NO! It's the same Gemini models, just accessed through Vertex AI.

Confusing naming:
- "Gemini API" = Direct API
- "Vertex AI Gemini API" = Same models via Vertex
- "Generative AI on Vertex AI" = Marketing name for same thing

### **3. "Do Maps API credits apply to AI APIs?"**

**NO!** Completely separate:
- **Maps Platform:** $200/month credit for Maps/Places/Directions/etc.
- **Gemini API:** Separate free tier (requests/day limits)
- **Vertex AI:** No free tier (but $300 new account credit)

### **4. "What's the difference between Places API and Geocoding?"**

- **Geocoding API:** Address → coordinates (or reverse)
  - "123 Main St" → (lat: 40.7, lng: -74.0)

- **Places API:** Search for businesses/POI
  - "Coffee shops near me" → List of cafes with details

Different pricing, different use cases!

### **5. "Can I use Vertex AI models in Gemini API?"**

They're the SAME models! You're choosing the ACCESS METHOD:
- Gemini API endpoint = Simpler, free tier
- Vertex AI endpoint = More features, no free tier

---

## Quick Decision Guide

**Choose Gemini API Free if:**
- ✅ Prototyping
- ✅ Small scale (<1,500 requests/day)
- ✅ Learning/experimenting
- ✅ No budget

**Choose Gemini API Paid if:**
- ✅ Simple production app
- ✅ Don't need enterprise features
- ✅ Moderate scale
- ✅ Want simple pricing

**Choose Vertex AI if:**
- ✅ Production at scale
- ✅ Need prompt caching (repeated prompts)
- ✅ Need fine-tuning
- ✅ Need SLAs/compliance
- ✅ Already using GCP

**For Maps/Places:**
- ✅ Start with Google Maps ($200 credit)
- ⚠️ Monitor usage carefully
- ⚠️ Consider alternatives if >$500/month

---

## Key Takeaways

### **Vertical Hierarchy:**
```
Organization → Folders → Projects → Resources
```
- Organization: Root (optional, need domain)
- Folders: Grouping (optional)
- Projects: Required, where work happens
- Resources: Actual cloud services

### **Horizontal (Billing):**
```
Billing Account ←linked to→ Projects
```
- Separate from hierarchy
- One billing account → many projects
- One project → one billing account

### **Costs:**
- Tracked per project
- Billed per billing account
- Bill shows per-project breakdown

### **AI Services:**
- Same models, different access methods
- Gemini API = Simple, free tier
- Vertex AI = Enterprise, no free tier, more features

### **Maps Services:**
- $200/month credit shared across all Maps APIs
- Plan usage to stay under free tier
- Cache aggressively to reduce costs

---

## Resources & Links

**Pricing calculators:**
- Gemini API: https://ai.google.dev/pricing
- Vertex AI: https://cloud.google.com/vertex-ai/pricing
- Maps Platform: https://mapsplatform.google.com/pricing/

**Documentation:**
- Gemini API: https://ai.google.dev/
- Vertex AI: https://cloud.google.com/vertex-ai/docs
- Maps Platform: https://developers.google.com/maps
- Resource Manager: https://cloud.google.com/resource-manager/docs

**GCP Console:**
- Projects: https://console.cloud.google.com/
- Billing: https://console.cloud.google.com/billing
- IAM: https://console.cloud.google.com/iam-admin

---

**Document version:** 1.0
**Last updated:** 2025-11-09
**Maintained by:** Project Documentation
