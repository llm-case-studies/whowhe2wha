# Google Cloud CLI (gcloud) Commands Reference

**Complete command-line journey for managing Google Cloud projects**

**Created:** 2025-11-09
**Last Updated:** 2025-11-09
**Project:** WhoWhe2Wha-Determ

---

## Table of Contents

1. [Authentication & Setup](#authentication--setup)
2. [Exploring & Examining](#exploring--examining)
3. [Cleanup Operations](#cleanup-operations)
4. [Project Creation & Configuration](#project-creation--configuration)
5. [Billing Management](#billing-management)
6. [API Management](#api-management)
7. [API Keys Management](#api-keys-management)
8. [Monitoring & Reporting](#monitoring--reporting)
9. [Common Patterns](#common-patterns)
10. [Troubleshooting](#troubleshooting)

---

## Authentication & Setup

### **Check Current Authentication**

```bash
# List authenticated accounts
gcloud auth list

# Output example:
# Credentialed Accounts
# ACTIVE  ACCOUNT
# *       funpilsner@gmail.com
```

### **Login/Authenticate**

```bash
# Login with browser
gcloud auth login

# Login for application default credentials (for local development)
gcloud auth application-default login
```

### **Set Active Account**

```bash
# Switch between accounts
gcloud config set account YOUR-EMAIL@gmail.com
```

### **Check Current Configuration**

```bash
# Show current config
gcloud config list

# Show current project
gcloud config get-value project
```

---

## Exploring & Examining

### **List All Projects**

```bash
# Basic list
gcloud projects list

# With specific columns
gcloud projects list --format="table(projectId,name,projectNumber,createTime)"

# Output example:
# PROJECT_ID                  NAME              PROJECT_NUMBER  CREATE_TIME
# gen-lang-client-0879139706  Gemini API        978713077205    2025-07-22T22:13:22.089544Z
# whowhe2wha-determ          WhoWhe2Wha-Determ  504924250149    2025-11-10T01:30:00.000000Z
```

### **Examine Specific Project**

```bash
# Get project details
gcloud projects describe PROJECT_ID

# Example:
gcloud projects describe whowhe2wha-determ

# Output includes: name, projectId, projectNumber, labels, createTime, lifecycleState
```

### **List Billing Accounts**

```bash
# List all billing accounts
gcloud billing accounts list --format="table(name,displayName,open,masterBillingAccount)"

# Output example:
# ACCOUNT_ID            NAME                OPEN   MASTER_ACCOUNT_ID
# 01F57C-BAED29-EF5B05  PronunCo            True
# 0195AD-8A658A-A3575A  My Billing Account  False
```

### **Check Project Billing Status**

```bash
# Check if project has billing enabled
gcloud billing projects describe PROJECT_ID

# Example:
gcloud billing projects describe whowhe2wha-determ

# Output:
# billingAccountName: billingAccounts/01F57C-BAED29-EF5B05
# billingEnabled: true
# name: projects/whowhe2wha-determ/billingInfo
# projectId: whowhe2wha-determ
```

### **Check Multiple Projects' Billing**

```bash
# Loop through multiple projects
for project in project1 project2 project3; do
  echo "=== Project: $project ==="
  gcloud billing projects describe $project --format="value(billingAccountName,billingEnabled)" 2>&1 || echo "No billing info"
  echo ""
done
```

### **List Enabled APIs in a Project**

```bash
# List all enabled APIs
gcloud services list --enabled --project=PROJECT_ID

# Show only service names
gcloud services list --enabled --project=PROJECT_ID --format="value(config.name)"

# Example:
gcloud services list --enabled --project=whowhe2wha-determ --format="value(config.name)"

# Output:
# maps-backend.googleapis.com
# places-backend.googleapis.com
# geocoding-backend.googleapis.com
# apikeys.googleapis.com
```

### **Filter for Specific APIs**

```bash
# Look for AI/Maps APIs
gcloud services list --enabled --project=PROJECT_ID --format="value(config.name)" | grep -E "(vertex|gemini|generative|maps|places|aiplatform)"

# Example output:
# aiplatform.googleapis.com
# generativelanguage.googleapis.com
# maps-backend.googleapis.com
# places-backend.googleapis.com
```

### **List Service Accounts**

```bash
# List service accounts in a project
gcloud iam service-accounts list --project=PROJECT_ID --format="table(email,displayName,disabled)"

# Example:
gcloud iam service-accounts list --project=whowhe2wha-determ
```

### **List API Keys**

```bash
# List all API keys in a project
gcloud services api-keys list --project=PROJECT_ID --format="table(name,displayName,restrictions)"

# Example output:
# NAME                                                                              DISPLAY_NAME                 RESTRICTIONS
# projects/978713077205/locations/global/keys/4c416f81-b988-41e3-a10c-2345cf59054f  Generative Language API Key  {'apiTargets': [{'service': 'generativelanguage.googleapis.com'}]}
```

### **Get API Key Value**

```bash
# Get the actual key string (use carefully - sensitive!)
gcloud services api-keys get-key-string PROJECT_KEY_PATH --format="value(keyString)"

# Example:
gcloud services api-keys get-key-string projects/978713077205/locations/global/keys/4c416f81-b988-41e3-a10c-2345cf59054f --format="value(keyString)"

# Output:
# AIzaSyBA31ZLx1ssYPNS-X2S0reAw1rbhmYnqg0
```

### **Get Billing Account Details**

```bash
# Detailed billing account info
gcloud billing accounts describe BILLING_ACCOUNT_ID --format="yaml"

# Example:
gcloud billing accounts describe 01F57C-BAED29-EF5B05 --format="yaml"

# Output:
# currencyCode: USD
# displayName: PronunCo
# masterBillingAccount: ''
# name: billingAccounts/01F57C-BAED29-EF5B05
# open: true
```

---

## Cleanup Operations

### **Delete Unused Projects**

```bash
# Delete a project
gcloud projects delete PROJECT_ID

# Delete without confirmation prompt
gcloud projects delete PROJECT_ID --quiet

# Example:
gcloud projects delete igneous-shell-431217-u5 --quiet

# Output:
# Deleted [https://cloudresourcemanager.googleapis.com/v1/projects/igneous-shell-431217-u5].
# You can undo this operation for a limited period by running the command below.
#     $ gcloud projects undelete igneous-shell-431217-u5
```

**Important Notes:**
- Projects can be undeleted within 30 days
- After 30 days, projects are permanently deleted
- Deleting a project stops all billing immediately
- All resources in the project are deleted

### **Undelete a Project (within 30 days)**

```bash
# Restore a deleted project
gcloud projects undelete PROJECT_ID

# Example:
gcloud projects undelete igneous-shell-431217-u5
```

### **Delete Multiple Projects**

```bash
# Delete several projects at once
for project in project1 project2 project3; do
  echo "Deleting: $project"
  gcloud projects delete $project --quiet
done
```

### **Remove API Key**

```bash
# Delete an API key
gcloud services api-keys delete KEY_PATH --project=PROJECT_ID

# Example:
gcloud services api-keys delete projects/123456/locations/global/keys/abc123 --project=whowhe2wha-determ
```

### **Disable an API**

```bash
# Disable an API in a project
gcloud services disable SERVICE_NAME --project=PROJECT_ID

# Example:
gcloud services disable maps-backend.googleapis.com --project=whowhe2wha-determ
```

**Warning:** Disabling an API will break applications using it!

---

## Project Creation & Configuration

### **Create New Project**

```bash
# Basic project creation
gcloud projects create PROJECT_ID --name="PROJECT_NAME"

# With labels
gcloud projects create PROJECT_ID \
  --name="PROJECT_NAME" \
  --labels=project=whowhe2wha,type=production

# Example:
gcloud projects create whowhe2wha-determ \
  --name="WhoWhe2Wha-Determ" \
  --labels=project=whowhe2wha,type=production

# Output:
# Create in progress for [https://cloudresourcemanager.googleapis.com/v1/projects/whowhe2wha-determ].
# Waiting for [operations/create_project.global.4727675597408687770] to finish...done.
```

**Project ID Requirements:**
- 6-30 characters
- Lowercase letters, numbers, hyphens
- Must start with letter
- **Cannot be changed after creation**
- Must be globally unique across ALL Google Cloud

**Project Name:**
- Friendly display name
- Can be changed later
- Doesn't need to be unique

### **Rename a Project**

```bash
# Update project name (display name only, not ID!)
gcloud projects update PROJECT_ID --name="NEW_NAME"

# Example:
gcloud projects update whowhe2wha-determ --name="WhoWhe2Wha Production"
```

**Note:** You CANNOT change the Project ID, only the display name!

### **Add/Update Project Labels**

```bash
# Update labels
gcloud projects update PROJECT_ID --update-labels=KEY1=VALUE1,KEY2=VALUE2

# Example:
gcloud projects update whowhe2wha-determ --update-labels=environment=production,owner=alex
```

### **Set Current Project**

```bash
# Set default project for subsequent commands
gcloud config set project PROJECT_ID

# Example:
gcloud config set project whowhe2wha-determ

# Now all commands will use this project by default
# No need to specify --project flag
```

---

## Billing Management

### **Link Project to Billing Account**

```bash
# Link billing to project
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID

# Example:
gcloud billing projects link whowhe2wha-determ --billing-account=01F57C-BAED29-EF5B05

# Output:
# billingAccountName: billingAccounts/01F57C-BAED29-EF5B05
# billingEnabled: true
# name: projects/whowhe2wha-determ/billingInfo
# projectId: whowhe2wha-determ
```

**Important:**
- Project must exist before linking billing
- Billing account must be active (open: true)
- You need `billing.user` permission on billing account
- Without billing, many APIs won't work (only free-tier services)

### **Unlink Billing from Project**

```bash
# Disable billing on a project
gcloud billing projects unlink PROJECT_ID

# Example:
gcloud billing projects unlink whowhe2wha-determ
```

**Warning:** This will disable all paid services immediately!

### **List Projects Linked to Billing Account**

```bash
# Show all projects using a billing account
gcloud billing projects list --billing-account=BILLING_ACCOUNT_ID

# Example:
gcloud billing projects list --billing-account=01F57C-BAED29-EF5B05

# Output shows: projectId, billingAccountName, billingEnabled
```

### **Check Who Can Use Billing Account**

```bash
# Get IAM policy for billing account
gcloud billing accounts get-iam-policy BILLING_ACCOUNT_ID

# Example:
gcloud billing accounts get-iam-policy 01F57C-BAED29-EF5B05
```

---

## API Management

### **Enable APIs**

```bash
# Enable a single API
gcloud services enable API_NAME --project=PROJECT_ID

# Example:
gcloud services enable maps-backend.googleapis.com --project=whowhe2wha-determ

# Enable multiple APIs at once
gcloud services enable \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  geocoding-backend.googleapis.com \
  --project=whowhe2wha-determ

# Output:
# Operation "operations/acat.p2-504924250149-6d3c0856-8cf6-4bc8-9a33-cb60099e54fb" finished successfully.
```

**Common API Names:**
- `aiplatform.googleapis.com` - Vertex AI
- `generativelanguage.googleapis.com` - Gemini API
- `maps-backend.googleapis.com` - Maps API
- `places-backend.googleapis.com` - Places API
- `geocoding-backend.googleapis.com` - Geocoding API
- `compute.googleapis.com` - Compute Engine
- `storage.googleapis.com` - Cloud Storage
- `apikeys.googleapis.com` - API Keys service (needed to create keys!)

### **List Available APIs**

```bash
# List all available APIs (not enabled, just available)
gcloud services list --available --project=PROJECT_ID

# Filter by keyword
gcloud services list --available --filter="name:maps" --project=PROJECT_ID
```

### **Check if Specific API is Enabled**

```bash
# Check single API status
gcloud services list --enabled --project=PROJECT_ID --filter="config.name=maps-backend.googleapis.com"

# Returns result if enabled, empty if not
```

### **Disable an API**

```bash
# Disable an API (careful!)
gcloud services disable API_NAME --project=PROJECT_ID

# Example:
gcloud services disable maps-backend.googleapis.com --project=whowhe2wha-determ
```

---

## API Keys Management

### **Enable API Keys Service**

```bash
# Must enable this before creating API keys
gcloud services enable apikeys.googleapis.com --project=PROJECT_ID

# Example:
gcloud services enable apikeys.googleapis.com --project=whowhe2wha-determ
```

### **Create API Key (Unrestricted - NOT RECOMMENDED)**

```bash
# Create unrestricted API key (dangerous!)
gcloud services api-keys create \
  --project=PROJECT_ID \
  --display-name="My API Key"

# This key can be used for ANY API - security risk!
```

### **Create API Key (Restricted - RECOMMENDED)**

```bash
# Create API key restricted to specific services
gcloud services api-keys create \
  --project=PROJECT_ID \
  --display-name="Maps Places Geocoding API Key" \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=places-backend.googleapis.com \
  --api-target=service=geocoding-backend.googleapis.com

# Example from our session:
gcloud services api-keys create \
  --project=whowhe2wha-determ \
  --display-name="Maps Places Geocoding API Key" \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=places-backend.googleapis.com \
  --api-target=service=geocoding-backend.googleapis.com \
  --format="value(response.keyString)"

# Output:
# AIzaSyBk59dJVrTwNMmGA4CLBWcdCcNFkGw_ikY
```

**Security Best Practices:**
- Always restrict API keys to specific APIs
- Use separate keys for different services
- Never commit keys to git
- Rotate keys regularly
- Add HTTP referrer restrictions for web apps
- Add IP restrictions for server apps

### **Create API Key with HTTP Referrer Restrictions**

```bash
# Restrict to specific websites
gcloud services api-keys create \
  --project=PROJECT_ID \
  --display-name="Maps API Key - Website Only" \
  --api-target=service=maps-backend.googleapis.com \
  --allowed-referrers="https://yourdomain.com/*" \
  --allowed-referrers="https://www.yourdomain.com/*"

# Multiple referrers allowed
```

### **Create API Key with IP Restrictions**

```bash
# Restrict to specific IP addresses
gcloud services api-keys create \
  --project=PROJECT_ID \
  --display-name="Maps API Key - Server Only" \
  --api-target=service=maps-backend.googleapis.com \
  --allowed-ips="203.0.113.1" \
  --allowed-ips="203.0.113.2/32"
```

### **List All API Keys**

```bash
# List keys in project
gcloud services api-keys list --project=PROJECT_ID

# With details
gcloud services api-keys list --project=PROJECT_ID --format="table(name,displayName,restrictions)"
```

### **Get API Key Details**

```bash
# Get specific key info
gcloud services api-keys describe KEY_PATH --project=PROJECT_ID

# Example:
gcloud services api-keys describe projects/504924250149/locations/global/keys/81b1b1a5-1331-4864-9635-a695acc80b18 --project=whowhe2wha-determ
```

### **Get API Key String (Secret Value)**

```bash
# Retrieve the actual key (sensitive!)
gcloud services api-keys get-key-string KEY_PATH --format="value(keyString)"

# Example:
gcloud services api-keys get-key-string projects/504924250149/locations/global/keys/81b1b1a5-1331-4864-9635-a695acc80b18 --format="value(keyString)"

# Output:
# AIzaSyBk59dJVrTwNMmGA4CLBWcdCcNFkGw_ikY
```

### **Update API Key Restrictions**

```bash
# Update existing key's restrictions
gcloud services api-keys update KEY_PATH \
  --project=PROJECT_ID \
  --clear-restrictions \
  --api-target=service=NEW_SERVICE.googleapis.com

# Example: Add another API to existing key
gcloud services api-keys update projects/504924250149/locations/global/keys/81b1b1a5-1331-4864-9635-a695acc80b18 \
  --project=whowhe2wha-determ \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=places-backend.googleapis.com \
  --api-target=service=geocoding-backend.googleapis.com \
  --api-target=service=directions-backend.googleapis.com
```

### **Delete API Key**

```bash
# Delete/revoke an API key
gcloud services api-keys delete KEY_PATH --project=PROJECT_ID

# Example:
gcloud services api-keys delete projects/504924250149/locations/global/keys/81b1b1a5-1331-4864-9635-a695acc80b18 --project=whowhe2wha-determ
```

---

## Monitoring & Reporting

### **View Project Resource Usage**

```bash
# Get project quotas
gcloud compute project-info describe --project=PROJECT_ID

# Check specific quota
gcloud compute regions describe REGION --project=PROJECT_ID
```

### **Check API Usage/Quotas**

```bash
# View quota for specific service
gcloud services quotas list --service=SERVICE_NAME --project=PROJECT_ID

# Example:
gcloud services quotas list --service=maps-backend.googleapis.com --project=whowhe2wha-determ
```

### **View Recent Operations**

```bash
# List recent operations
gcloud projects get-operations --project=PROJECT_ID
```

### **Check Current Costs (requires billing export)**

```bash
# This requires BigQuery billing export setup
# View in console: https://console.cloud.google.com/billing
```

### **Generate Project Report**

```bash
# Complete project audit
echo "=== Project Information ==="
gcloud projects describe PROJECT_ID

echo "=== Billing Status ==="
gcloud billing projects describe PROJECT_ID

echo "=== Enabled APIs ==="
gcloud services list --enabled --project=PROJECT_ID

echo "=== API Keys ==="
gcloud services api-keys list --project=PROJECT_ID

echo "=== Service Accounts ==="
gcloud iam service-accounts list --project=PROJECT_ID
```

---

## Common Patterns

### **Complete New Project Setup**

```bash
#!/bin/bash
# Complete project setup script

PROJECT_ID="my-new-project"
PROJECT_NAME="My New Project"
BILLING_ACCOUNT="01F57C-BAED29-EF5B05"

# 1. Create project
echo "Creating project..."
gcloud projects create $PROJECT_ID --name="$PROJECT_NAME"

# 2. Link billing
echo "Linking billing..."
gcloud billing projects link $PROJECT_ID --billing-account=$BILLING_ACCOUNT

# 3. Enable APIs
echo "Enabling APIs..."
gcloud services enable \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  geocoding-backend.googleapis.com \
  apikeys.googleapis.com \
  --project=$PROJECT_ID

# 4. Create API key
echo "Creating API key..."
API_KEY=$(gcloud services api-keys create \
  --project=$PROJECT_ID \
  --display-name="Maps API Key" \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=places-backend.googleapis.com \
  --api-target=service=geocoding-backend.googleapis.com \
  --format="value(response.keyString)")

echo "Project setup complete!"
echo "API Key: $API_KEY"
```

### **Audit All Projects**

```bash
#!/bin/bash
# Audit all projects in account

for project in $(gcloud projects list --format="value(projectId)"); do
  echo "================================"
  echo "Project: $project"
  echo "================================"

  # Get billing status
  billing=$(gcloud billing projects describe $project --format="value(billingEnabled)" 2>&1)
  echo "Billing: $billing"

  # Count enabled APIs
  api_count=$(gcloud services list --enabled --project=$project 2>&1 | wc -l)
  echo "Enabled APIs: $api_count"

  # List API keys
  key_count=$(gcloud services api-keys list --project=$project 2>&1 | grep "projects/" | wc -l)
  echo "API Keys: $key_count"

  echo ""
done
```

### **Cleanup Old Projects**

```bash
#!/bin/bash
# Delete projects older than 30 days with specific label

CUTOFF_DATE=$(date -d '30 days ago' +%Y%m%d)

for project in $(gcloud projects list --format="value(projectId)" --filter="labels.type=poc"); do
  created=$(gcloud projects describe $project --format="value(labels.created)")

  if [ "$created" -lt "$CUTOFF_DATE" ]; then
    echo "Deleting old POC: $project (created $created)"
    gcloud projects delete $project --quiet
  fi
done
```

### **Migrate Project to Organization**

```bash
# Move project from no-org to organization
gcloud projects move PROJECT_ID --organization=ORGANIZATION_ID

# Example:
gcloud projects move whowhe2wha-determ --organization=123456789012

# Or move to folder within org
gcloud projects move PROJECT_ID --folder=FOLDER_ID
```

---

## Troubleshooting

### **Permission Errors**

```bash
# Error: "You do not have permission to access project [PROJECT_ID]"

# Check your current account
gcloud auth list

# Check IAM permissions on project
gcloud projects get-iam-policy PROJECT_ID

# Check if you're the owner
gcloud projects get-iam-policy PROJECT_ID --flatten="bindings[].members" --filter="bindings.role:roles/owner"
```

### **Billing Errors**

```bash
# Error: "Billing is not enabled for project [PROJECT_ID]"

# Check billing status
gcloud billing projects describe PROJECT_ID

# Enable billing
gcloud billing projects link PROJECT_ID --billing-account=BILLING_ACCOUNT_ID

# Verify billing account is open
gcloud billing accounts list
```

### **API Not Available**

```bash
# Error: "API [SERVICE_NAME] not enabled on project [PROJECT_ID]"

# Enable the API
gcloud services enable SERVICE_NAME --project=PROJECT_ID

# Check if API is enabled
gcloud services list --enabled --project=PROJECT_ID --filter="config.name=SERVICE_NAME"
```

### **Quota Exceeded**

```bash
# Error: "Quota exceeded for quota metric..."

# Check current quotas
gcloud services quotas list --service=SERVICE_NAME --project=PROJECT_ID

# Request quota increase (via console)
# https://console.cloud.google.com/iam-admin/quotas?project=PROJECT_ID
```

### **Project Already Exists**

```bash
# Error: "Project [PROJECT_ID] already exists"

# Project IDs are globally unique
# Choose a different ID
gcloud projects create different-project-id --name="My Project"

# Or check if you own it
gcloud projects list --filter="projectId=PROJECT_ID"
```

### **Cannot Delete Project**

```bash
# Error: "Project [PROJECT_ID] has active resources"

# Some resources must be deleted first
# Check for:
# - App Engine apps (cannot be deleted!)
# - Firestore databases
# - Some managed services

# Force delete (if allowed)
gcloud projects delete PROJECT_ID --quiet

# If App Engine: Can't delete project, must create new one
```

---

## Output Formatting

### **Common Format Options**

```bash
# Table format (default, human-readable)
gcloud projects list --format="table(projectId,name,createTime)"

# JSON format (for scripting)
gcloud projects list --format=json

# YAML format
gcloud projects list --format=yaml

# CSV format
gcloud projects list --format="csv(projectId,name)"

# Get single value
gcloud projects describe PROJECT_ID --format="value(projectNumber)"

# Custom format with specific fields
gcloud projects list --format="table[box](projectId:label='ID',name:label='Name',createTime.date())"
```

### **Filtering Results**

```bash
# Filter by field value
gcloud projects list --filter="name:Test"

# Filter by label
gcloud projects list --filter="labels.type=poc"

# Multiple conditions
gcloud projects list --filter="labels.type=poc AND createTime<2024-01-01"

# Regular expressions
gcloud projects list --filter="projectId~'^test-.*'"
```

---

## Security Best Practices

### **API Key Security**

```bash
# ❌ BAD: Unrestricted key
gcloud services api-keys create --project=PROJECT_ID --display-name="Key"

# ✅ GOOD: Restricted key
gcloud services api-keys create \
  --project=PROJECT_ID \
  --display-name="Maps Key - Website" \
  --api-target=service=maps-backend.googleapis.com \
  --allowed-referrers="https://yourdomain.com/*"

# ✅ BETTER: Separate keys per service
gcloud services api-keys create --display-name="Maps Only" --api-target=service=maps-backend.googleapis.com
gcloud services api-keys create --display-name="Places Only" --api-target=service=places-backend.googleapis.com
```

### **Service Accounts vs API Keys**

**Use API Keys for:**
- Client-side applications (websites, mobile apps)
- Simple authentication
- Public APIs

**Use Service Accounts for:**
- Server-side applications
- Fine-grained IAM permissions
- Resource access control
- Secure credential management

```bash
# Create service account (more secure than API keys)
gcloud iam service-accounts create SERVICE_ACCOUNT_NAME \
  --project=PROJECT_ID \
  --display-name="My Service Account"

# Grant permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# Generate key file
gcloud iam service-accounts keys create credentials.json \
  --iam-account=SERVICE_ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com
```

---

## Quick Reference: Our Session Commands

### **What We Did: Complete WhoWhe2Wha Setup**

```bash
# 1. Audit existing setup
gcloud auth list
gcloud projects list --format="table(projectId,name,projectNumber,createTime)"
gcloud billing accounts list --format="table(name,displayName,open)"

# 2. Check each project's billing
gcloud billing projects describe gen-lang-client-0879139706
gcloud billing projects describe igneous-shell-431217-u5
gcloud billing projects describe plasma-circle-416518

# 3. Check enabled APIs
gcloud services list --enabled --project=gen-lang-client-0879139706 --format="value(config.name)"

# 4. List existing API keys
gcloud services api-keys list --project=gen-lang-client-0879139706
gcloud services api-keys get-key-string projects/978713077205/locations/global/keys/4c416f81-b988-41e3-a10c-2345cf59054f

# 5. Delete old unused projects
gcloud projects delete igneous-shell-431217-u5 --quiet
gcloud projects delete plasma-circle-416518 --quiet

# 6. Create new project
gcloud projects create whowhe2wha-determ \
  --name="WhoWhe2Wha-Determ" \
  --labels=project=whowhe2wha,type=production

# 7. Link billing
gcloud billing projects link whowhe2wha-determ \
  --billing-account=01F57C-BAED29-EF5B05

# 8. Enable APIs
gcloud services enable \
  maps-backend.googleapis.com \
  places-backend.googleapis.com \
  geocoding-backend.googleapis.com \
  apikeys.googleapis.com \
  --project=whowhe2wha-determ

# 9. Create API key
gcloud services api-keys create \
  --project=whowhe2wha-determ \
  --display-name="Maps Places Geocoding API Key" \
  --api-target=service=maps-backend.googleapis.com \
  --api-target=service=places-backend.googleapis.com \
  --api-target=service=geocoding-backend.googleapis.com \
  --format="value(response.keyString)"

# Result: AIzaSyBk59dJVrTwNMmGA4CLBWcdCcNFkGw_ikY
```

---

## Resources

**Official Documentation:**
- gcloud CLI Reference: https://cloud.google.com/sdk/gcloud/reference
- gcloud Cheat Sheet: https://cloud.google.com/sdk/docs/cheatsheet
- API Keys: https://cloud.google.com/docs/authentication/api-keys
- Project Management: https://cloud.google.com/resource-manager/docs/creating-managing-projects

**Interactive Tutorial:**
```bash
# Run interactive gcloud tutorial
gcloud interactive
```

**Get Help:**
```bash
# General help
gcloud help

# Command-specific help
gcloud projects help
gcloud projects create --help

# Search help
gcloud help -- SEARCH_TERM
```

---

## Appendix: Command Aliases & Shortcuts

### **Useful Bash Aliases**

Add to your `~/.bashrc` or `~/.zshrc`:

```bash
# Quick project info
alias gcp-projects='gcloud projects list --format="table(projectId,name,createTime)"'

# Check current project
alias gcp-current='gcloud config get-value project'

# Quick project switch
gcp-use() {
  gcloud config set project $1
  echo "Switched to project: $1"
}

# List enabled APIs
gcp-apis() {
  gcloud services list --enabled --project=$(gcloud config get-value project) --format="value(config.name)"
}

# Quick billing check
gcp-billing() {
  gcloud billing projects describe $(gcloud config get-value project)
}

# Create API key shortcut
gcp-create-key() {
  local name=$1
  local service=$2
  gcloud services api-keys create \
    --display-name="$name" \
    --api-target=service=$service \
    --format="value(response.keyString)"
}

# Usage:
# gcp-use whowhe2wha-determ
# gcp-apis
# gcp-create-key "My Maps Key" "maps-backend.googleapis.com"
```

---

**Document version:** 1.0
**Last updated:** 2025-11-09
**Maintained by:** Project Documentation

**Next Steps:**
- Set up billing alerts
- Create monitoring dashboard
- Document API usage patterns
- Create backup/disaster recovery plan
