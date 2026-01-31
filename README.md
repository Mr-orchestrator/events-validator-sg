# Events Validator API - SG opensource

> **Zero-Cost Event Validation Infrastructure** | Validate JSON event payloads in real-time using completely free cloud services

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live-brightgreen)](https://validatorsrc.vercel.app)
[![Live on Render](https://img.shields.io/badge/Render-Live-blue)](https://events-validator-sg.onrender.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)

---

## 📋 What This Project Does

This system validates incoming JSON event data against predefined schemas before the data reaches your analytics platforms (like Google Analytics 4, Mixpanel, or Amplitude). It catches malformed events, missing parameters, and type mismatches in real-time.

**Primary Use Cases:**
- Quality assurance for tracking implementations
- Real-time validation of Server-Side GTM event streams
- Pre-flight checks for marketing and analytics data pipelines
- Debugging data layer issues before they pollute your reports

---

## 🔄 Migration Summary: What Changed

This project was originally built on Google Cloud Platform (GCP). It has been migrated to **completely free** cloud services while maintaining identical functionality.

### Original Architecture (GCP - Paid)

| Component | GCP Service | Monthly Cost |
|-----------|-------------|--------------|
| API Hosting | Cloud Functions | ~$5-20 |
| Schema Storage | Cloud Storage (GCS) | ~$1-5 |
| Event Logging | BigQuery | ~$5-50 |
| API Security | API Gateway | ~$3-10 |
| UI Hosting | Cloud Run | ~$5-15 |

### New Architecture (Free Cloud - $0)

| Component | Free Service | Cost |
|-----------|--------------|------|
| API Hosting | Vercel / Render | **Free** |
| Schema Storage | Supabase Storage | **Free** |
| Event Logging | Supabase PostgreSQL | **Free** |
| UI Hosting | Streamlit Community Cloud | **Free** |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        EVENT VALIDATION FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐         ┌──────────────────┐         ┌──────────────┐
    │ Event Source │   POST  │  Validator API   │  Query  │   Supabase   │
    │  (GTM/App)   │ ──────► │ (Vercel/Render)  │ ◄─────► │   Storage    │
    └──────────────┘         └────────┬─────────┘         │  (Schemas)   │
                                      │                   └──────────────┘
                                      │ Insert
                                      ▼
                             ┌──────────────────┐
                             │    Supabase      │
                             │   PostgreSQL     │
                             │  (Event Logs)    │
                             └──────────────────┘
                                      ▲
                                      │ Read
                             ┌────────┴─────────┐
                             │   Streamlit UI   │
                             │ (Schema Builder) │
                             └──────────────────┘
```

### Request Flow

1. **Event Source** sends JSON payload to validator endpoint
2. **Validator API** extracts event name and fetches corresponding schema from Supabase Storage
3. **Validation Engine** compares payload against schema rules (types, required fields, patterns)
4. **Results** are logged to Supabase PostgreSQL with detailed field-level status
5. **Response** returns validation status to the caller

---

## 📁 Repository Structure

```
events-validator-sg/
├── validator_src/           # Node.js validation API
│   ├── server.js            # Express server (Vercel/Render entry point)
│   ├── index.js             # Core validation logic
│   ├── helpers/
│   │   ├── supabaseHelpers.js    # Supabase client (storage + database)
│   │   ├── validationHelpers.js  # Schema comparison engine
│   │   └── loggingHelpers.js     # Log entry formatting
│   └── package.json
│
├── streamlit_ev/            # Python schema management UI
│   ├── app/
│   │   ├── app.py           # Main Streamlit application
│   │   └── helpers/
│   │       └── supabase_client.py  # Python Supabase client
│   └── pyproject.toml
│
├── terraform_backend/       # Legacy GCP infrastructure (optional)
├── terraform_ui/            # Legacy GCP UI infrastructure (optional)
│
├── supabase_schema.sql      # Database table definition
├── Dockerfile               # Container build for Render
└── FREE_CLOUD_DEPLOYMENT.md # Step-by-step deployment guide
```

---

## 🚀 Live Deployments

| Platform | URL | Purpose |
|----------|-----|---------|
| **Vercel** | https://validatorsrc.vercel.app | Primary API (faster cold starts) |
| **Render** | https://events-validator-sg.onrender.com | Backup API (container-based) |
| **GitHub** | https://github.com/Mr-orchestrator/events-validator-sg | Source code |

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | API information and status |
| `GET` | `/health` | Health check endpoint |
| `POST` | `/api/validate` | Validate event payload |
| `POST` | `/eventsValidator` | Alias for validation (GTM compatible) |

---

## 🔧 Core Capabilities

### Validation Features

| Feature | Description | Example |
|---------|-------------|---------|
| **Type Checking** | Verify data types match schema | `string`, `number`, `boolean`, `array`, `object` |
| **Required Fields** | Ensure mandatory parameters exist | `event_name` must be present |
| **Pattern Matching** | Validate strings against regex | `^user_\d+$` for user IDs |
| **Exact Values** | Enforce specific values | `currency` must be `"USD"` |
| **Nested Objects** | Validate complex structures | Items array with product schemas |
| **Optional Fields** | Allow missing parameters | `promo_code` can be absent |

### Request Format

```json
{
  "data": {
    "event_name": "purchase",
    "transaction_id": "TXN-12345",
    "value": 99.99,
    "currency": "USD",
    "items": [
      {
        "item_id": "SKU-001",
        "item_name": "Product Name",
        "price": 99.99
      }
    ]
  }
}
```

### Response Format

```json
{
  "status": "event valid",
  "eventsLogged": 1
}
```

---

## 📝 Files Modified During Migration

### Replaced Files

| Original File | New File | Change Description |
|---------------|----------|-------------------|
| `helpers/cloudHelpers.js` | `helpers/supabaseHelpers.js` | GCP SDK replaced with Supabase client |
| `package.json` | `package.json` | Removed `@google-cloud/*`, added `@supabase/supabase-js` |
| `.env.example` | `.env.example` | GCP credentials replaced with Supabase URL/key |

### New Files Created

| File | Purpose |
|------|---------|
| `server.js` | Express server for Vercel/Render deployment |
| `supabaseHelpers.js` | Supabase storage and database operations |
| `supabase_client.py` | Python Supabase client for Streamlit |
| `supabase_schema.sql` | PostgreSQL table schema |
| `Dockerfile` | Container definition for Render |
| `render.yaml` | Render deployment configuration |
| `FREE_CLOUD_DEPLOYMENT.md` | Migration and deployment guide |

### Modified Files

| File | Changes Made |
|------|--------------|
| `index.js` | Replaced GCP imports with Supabase; updated storage/database calls |
| `validationHelpers.js` | Changed import path from `cloudHelpers` to `supabaseHelpers` |
| `pyproject.toml` | Replaced `google-cloud-*` with `supabase` package |
| `README.md` | Complete rewrite for new architecture |

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account (free tier)

### Setup

```bash
# Clone repository
git clone https://github.com/Mr-orchestrator/events-validator-sg.git
cd events-validator-sg/validator_src

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Service role key (not anon key) |
| `STORAGE_BUCKET` | Schema storage bucket name |
| `DB_TABLE` | PostgreSQL table for logs |
| `EVENT_NAME_ATTRIBUTE` | JSON path to event name field |
| `EVENT_DATA_PATH` | JSON path to event data object |

---

## 📊 Database Schema

```sql
CREATE TABLE event_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id VARCHAR(255) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    field VARCHAR(255),
    error_type VARCHAR(100),
    expected TEXT,
    actual TEXT,
    value TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) NOT NULL,
    event_data TEXT,
    date_utc DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔌 Integration Examples

### Server-Side GTM

Use the **JSON HTTP Request** tag to send event data:

1. **URL**: `https://validatorsrc.vercel.app/api/validate`
2. **Method**: POST
3. **Body**: Include all Event Data
4. **Trigger**: Sample based on volume to manage usage

### JavaScript Fetch

```javascript
const response = await fetch('https://validatorsrc.vercel.app/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      event_name: 'page_view',
      page_location: window.location.href,
      page_title: document.title
    }
  })
});

const result = await response.json();
console.log(result.status); // "event valid" or error details
```

### cURL

```bash
curl -X POST https://validatorsrc.vercel.app/api/validate \
  -H "Content-Type: application/json" \
  -d '{"data":{"event_name":"test_event","param":"value"}}'
```

---

## 📄 License

This project is released under the **GNU General Public License v3.0**. You are free to use, modify, and distribute this software.

**Maintained by:** SG opensource

**Repository:** https://github.com/Mr-orchestrator/events-validator-sg
