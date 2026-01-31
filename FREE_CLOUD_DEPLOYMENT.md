# Free Cloud Deployment Guide - SG opensource

This guide explains how to deploy the Events Validator on **free cloud services** (Supabase + Vercel/Render).

## 🆓 Free Services Used

| Component | Service | Free Tier |
|-----------|---------|-----------|
| Database | Supabase PostgreSQL | 500MB, unlimited API |
| Storage | Supabase Storage | 1GB storage |
| API/Backend | Vercel or Render | 100k requests/month |
| UI | Streamlit Cloud | Free hosting |

---

## 📋 Step 1: Set Up Supabase (5 minutes)

1. **Create account** at [supabase.com](https://supabase.com)
2. **Create new project** (choose free tier)
3. **Run database schema**:
   - Go to SQL Editor
   - Copy contents of `supabase_schema.sql`
   - Click "Run"

4. **Create storage bucket**:
   - Go to Storage
   - Click "New bucket"
   - Name: `schemas`
   - Public: OFF

5. **Get your keys**:
   - Go to Settings > API
   - Copy: `Project URL` → `SUPABASE_URL`
   - Copy: `service_role` key → `SUPABASE_SERVICE_KEY`

---

## 📋 Step 2: Deploy Validator API

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd validator_src
   vercel
   ```

3. **Set environment variables** in Vercel Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `STORAGE_BUCKET=schemas`
   - `DB_TABLE=event_logs`

### Option B: Deploy to Render (Free)

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables

### Option C: Deploy to Railway (Free $5 credit/month)

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables

---

## 📋 Step 3: Deploy Streamlit UI

### Option A: Streamlit Community Cloud (Easiest)

1. Push code to GitHub
2. Go to [share.streamlit.io](https://share.streamlit.io)
3. Connect your repo
4. Set main file: `streamlit_ev/app/app.py`
5. Add secrets in Streamlit dashboard:
   ```toml
   SUPABASE_URL = "https://your-project.supabase.co"
   SUPABASE_SERVICE_KEY = "your-service-key"
   STORAGE_BUCKET = "schemas"
   DB_TABLE = "event_logs"
   ```

### Option B: Deploy to Render

1. Create new Web Service
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `streamlit run app/app.py --server.port $PORT`

---

## 📋 Step 4: Upload Initial Schemas

1. Go to Supabase Dashboard > Storage > schemas bucket
2. Upload your JSON schema files (e.g., `purchase.json`, `sign_up.json`)
3. Or use the Streamlit UI to create schemas

---

## 🧪 Step 5: Test Your Deployment

```bash
curl -X POST "https://your-vercel-app.vercel.app/api/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "event_name": "purchase",
      "transaction_id": "T12345",
      "value": 99.99
    }
  }'
```

Expected response:
```json
{"status":"event valid","eventsLogged":1}
```

---

## 💰 Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| Supabase | $0 (free tier) |
| Vercel | $0 (free tier) |
| Streamlit Cloud | $0 (free) |
| **Total** | **$0** |

---

## 🔧 Troubleshooting

### "Supabase client not initialized"
- Check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set correctly
- Ensure keys don't have extra spaces

### "Storage bucket not found"
- Create bucket named `schemas` in Supabase Storage
- Check `STORAGE_BUCKET` env var matches bucket name

### "Table not found"
- Run `supabase_schema.sql` in SQL Editor
- Check `DB_TABLE` env var matches table name

---

## 📞 Support

Maintained by **SG opensource**
