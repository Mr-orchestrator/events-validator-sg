# Events Validator - Project Documentation

## SG opensource | Free Cloud Edition

**Document Version:** 1.0  
**Date:** January 31, 2026  
**Project Status:** ✅ Completed & Live

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Objectives](#2-project-objectives)
3. [What Was Done](#3-what-was-done)
4. [Technical Architecture](#4-technical-architecture)
5. [Live Deployments](#5-live-deployments)
6. [How to Use](#6-how-to-use)
7. [Pending / Future Work](#7-pending--future-work)
8. [Cost Analysis](#8-cost-analysis)

---

## 1. Executive Summary

This project migrated an event validation system from **paid Google Cloud Platform (GCP)** services to **completely free** cloud alternatives. The system validates JSON event data in real-time, catching data quality issues before they reach analytics platforms.

### Key Achievements

| Metric | Before | After |
|--------|--------|-------|
| Monthly Cost | $20-100 | **$0** |
| Hosting | GCP Cloud Functions | Vercel + Render |
| Database | BigQuery | Supabase PostgreSQL |
| Storage | Cloud Storage | Supabase Storage |
| Deployment Time | ~30 min (Terraform) | ~5 min |

---

## 2. Project Objectives

### Primary Goals

1. ✅ **Eliminate cloud costs** - Migrate to free-tier services
2. ✅ **Maintain functionality** - Same validation capabilities
3. ✅ **Improve deployment** - Simpler setup without Terraform
4. ✅ **Rebrand** - Change from "Defused Data" to "SG opensource"

### Secondary Goals

1. ✅ **Dual hosting** - Deploy to both Vercel and Render for redundancy
2. ✅ **Documentation** - Complete README rewrite
3. ⏳ **Streamlit UI** - Pending deployment to Streamlit Community Cloud

---

## 3. What Was Done

### 3.1 Code Migration

| Task | Status | Details |
|------|--------|---------|
| Replace GCP SDK with Supabase | ✅ Done | `cloudHelpers.js` → `supabaseHelpers.js` |
| Create Express server | ✅ Done | New `server.js` for Vercel/Render |
| Update dependencies | ✅ Done | Removed `@google-cloud/*`, added `@supabase/supabase-js` |
| Create Python Supabase client | ✅ Done | `supabase_client.py` for Streamlit |
| Update environment configs | ✅ Done | New `.env.example` files |

### 3.2 Infrastructure Setup

| Task | Status | Details |
|------|--------|---------|
| Create Supabase project | ✅ Done | Database + Storage configured |
| Create `event_logs` table | ✅ Done | PostgreSQL schema deployed |
| Create `schemas` storage bucket | ✅ Done | For JSON schema files |
| Upload 36 GA4 schemas | ✅ Done | All recommended events |

### 3.3 Deployments

| Platform | Status | URL |
|----------|--------|-----|
| Vercel | ✅ Live | https://validatorsrc.vercel.app |
| Render | ✅ Live | https://events-validator-sg.onrender.com |
| GitHub | ✅ Pushed | https://github.com/Mr-orchestrator/events-validator-sg |

### 3.4 Documentation

| Document | Status | Purpose |
|----------|--------|---------|
| README.md | ✅ Rewritten | Project overview, architecture, usage |
| FREE_CLOUD_DEPLOYMENT.md | ✅ Created | Step-by-step deployment guide |
| supabase_schema.sql | ✅ Created | Database table definition |
| PROJECT_DOCUMENTATION.md | ✅ Created | This document |

### 3.5 Branding Changes

| Original | New |
|----------|-----|
| Defused Data | SG opensource |
| events-validator | events-validator-sg |

---

## 4. Technical Architecture

### 4.1 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    EVENT VALIDATION SYSTEM                           │
└─────────────────────────────────────────────────────────────────────┘

   ┌─────────────┐                                    ┌─────────────┐
   │   Website   │                                    │   Mobile    │
   │  Data Layer │                                    │    App      │
   └──────┬──────┘                                    └──────┬──────┘
          │                                                  │
          └────────────────────┬─────────────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Server-Side GTM    │
                    │  (sGTM Container)   │
                    └──────────┬──────────┘
                               │ POST /api/validate
                               ▼
          ┌────────────────────────────────────────────┐
          │         VALIDATOR API                       │
          │  ┌─────────────┐    ┌─────────────┐        │
          │  │   Vercel    │ OR │   Render    │        │
          │  │  (Primary)  │    │  (Backup)   │        │
          │  └─────────────┘    └─────────────┘        │
          └────────────────────┬───────────────────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │                   │                   │
           ▼                   ▼                   ▼
   ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
   │   Supabase    │   │   Supabase    │   │   Streamlit   │
   │   Storage     │   │   PostgreSQL  │   │   UI (TBD)    │
   │  (Schemas)    │   │   (Logs)      │   │               │
   └───────────────┘   └───────────────┘   └───────────────┘
```

### 4.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML/Express | API landing page |
| **API Server** | Node.js + Express | Request handling |
| **Validation Engine** | Custom JS | Schema comparison |
| **Database** | Supabase PostgreSQL | Event logs storage |
| **File Storage** | Supabase Storage | JSON schemas |
| **Hosting (Primary)** | Vercel | Serverless functions |
| **Hosting (Backup)** | Render | Container-based |
| **UI (Pending)** | Streamlit | Schema management |

### 4.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | API info and status page |
| `GET` | `/health` | Health check (returns `{"status":"ok"}`) |
| `POST` | `/api/validate` | Validate event payload |
| `POST` | `/eventsValidator` | Alias for GTM compatibility |

### 4.4 Database Schema

```sql
CREATE TABLE event_logs (
    id UUID PRIMARY KEY,
    event_id VARCHAR(255),      -- Unique event identifier
    event_name VARCHAR(255),    -- e.g., "purchase", "add_to_cart"
    field VARCHAR(255),         -- Field being validated
    error_type VARCHAR(100),    -- "missing", "type", "value"
    expected TEXT,              -- What was expected
    actual TEXT,                -- What was received
    value TEXT,                 -- Field value
    timestamp TIMESTAMPTZ,      -- When validated
    status VARCHAR(50),         -- "valid" or "error"
    event_data TEXT,            -- Full payload (optional)
    date_utc DATE,              -- Date partition
    created_at TIMESTAMPTZ      -- Record creation time
);
```

---

## 5. Live Deployments

### 5.1 Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Vercel API** | https://validatorsrc.vercel.app | ✅ Online |
| **Render API** | https://events-validator-sg.onrender.com | ✅ Online |
| **GitHub Repo** | https://github.com/Mr-orchestrator/events-validator-sg | ✅ Public |
| **Supabase** | https://dnwahzajlzkamlubvfpy.supabase.co | ✅ Active |

### 5.2 Test Commands

**Health Check:**
```bash
curl https://validatorsrc.vercel.app/health
```

**Validate Event:**
```bash
curl -X POST https://validatorsrc.vercel.app/api/validate \
  -H "Content-Type: application/json" \
  -d '{"data":{"event_name":"purchase","transaction_id":"TXN-123","value":99.99,"currency":"USD"}}'
```

---

## 6. How to Use

### 6.1 For Server-Side GTM Integration

1. **Install** the JSON HTTP Request tag in your sGTM container
2. **Configure** destination URL: `https://validatorsrc.vercel.app/api/validate`
3. **Set body** to include Event Data as JSON: `{"data": {{Event Data}}}`
4. **Trigger** on events you want to validate (purchase, add_to_cart, etc.)
5. **Sample** traffic (1-10%) to manage usage on free tier

### 6.2 For Direct API Calls

```javascript
const response = await fetch('https://validatorsrc.vercel.app/api/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: {
      event_name: 'purchase',
      transaction_id: 'TXN-12345',
      value: 99.99,
      currency: 'USD',
      items: [{ item_id: 'SKU-001', item_name: 'Product', price: 99.99 }]
    }
  })
});
```

### 6.3 Available Event Schemas (36 Total)

**E-commerce Events:**
- purchase, add_to_cart, remove_from_cart, view_cart
- begin_checkout, add_payment_info, add_shipping_info
- view_item, view_item_list, select_item
- view_promotion, select_promotion, refund

**User Events:**
- login, sign_up, search, share, generate_lead

**Gaming Events:**
- level_up, level_start, level_end, tutorial_begin, tutorial_complete
- earn_virtual_currency, spend_virtual_currency, unlock_achievement, post_score

**Lead Management:**
- qualify_lead, working_lead, disqualify_lead
- close_convert_lead, close_unconvert_lead

---

## 7. Pending / Future Work

### 7.1 High Priority

| Task | Status | Effort | Description |
|------|--------|--------|-------------|
| Deploy Streamlit UI | ⏳ Pending | 2 hours | Schema management interface |
| Mark optional fields | ⏳ Pending | 1 hour | Update schemas to reduce false errors |
| Add page_view schema | ⏳ Pending | 30 min | Common event not in GA4 recommended |

### 7.2 Medium Priority

| Task | Status | Effort | Description |
|------|--------|--------|-------------|
| Custom domain | ⏳ Pending | 30 min | Point own domain to Vercel |
| Rate limiting | ⏳ Pending | 2 hours | Prevent abuse of free tier |
| Error alerting | ⏳ Pending | 2 hours | Notify on validation failures |

### 7.3 Low Priority / Nice-to-Have

| Task | Status | Effort | Description |
|------|--------|--------|-------------|
| Dashboard visualization | ⏳ Pending | 4 hours | Charts for validation stats |
| Schema versioning | ⏳ Pending | 4 hours | Track schema changes over time |
| Batch validation | ⏳ Pending | 2 hours | Validate multiple events at once |

---

## 8. Cost Analysis

### 8.1 Previous Costs (GCP)

| Service | Monthly Cost |
|---------|--------------|
| Cloud Functions | $5-20 |
| Cloud Storage | $1-5 |
| BigQuery | $5-50 |
| API Gateway | $3-10 |
| Cloud Run (UI) | $5-15 |
| **Total** | **$19-100/month** |

### 8.2 Current Costs (Free Cloud)

| Service | Monthly Cost | Free Tier Limit |
|---------|--------------|-----------------|
| Vercel | $0 | 100GB bandwidth, 100k function calls |
| Render | $0 | 750 hours/month |
| Supabase | $0 | 500MB database, 1GB storage |
| **Total** | **$0/month** | Sufficient for dev/small production |

### 8.3 Savings

- **Monthly savings:** $19-100
- **Annual savings:** $228-1,200
- **Break-even:** Immediate (no cost)

---

## Appendix A: File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `validator_src/server.js` | Created | Express server entry point |
| `validator_src/helpers/supabaseHelpers.js` | Created | Supabase client |
| `validator_src/helpers/cloudHelpers.js` | Kept | Legacy GCP code (unused) |
| `validator_src/index.js` | Modified | Updated imports |
| `validator_src/package.json` | Modified | New dependencies |
| `streamlit_ev/app/helpers/supabase_client.py` | Created | Python Supabase client |
| `supabase_schema.sql` | Created | Database schema |
| `Dockerfile` | Created | Render deployment |
| `README.md` | Rewritten | Complete documentation |

---

## Appendix B: Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJhbGc...` |
| `STORAGE_BUCKET` | Schema storage bucket | `schemas` |
| `DB_TABLE` | Logs table name | `event_logs` |
| `EVENT_NAME_ATTRIBUTE` | Event name field | `event_name` |
| `EVENT_DATA_PATH` | Data object path | `data` |
| `LOG_VALID_FIELDS` | Log valid fields | `true` |

---

**Document prepared by:** Cascade AI Assistant  
**For:** SG opensource  
**Date:** January 31, 2026
