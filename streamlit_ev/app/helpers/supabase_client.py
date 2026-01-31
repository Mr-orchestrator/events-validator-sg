from supabase import create_client, Client
from dotenv import load_dotenv
import json
import os
import streamlit as st

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
storage_bucket = os.getenv("STORAGE_BUCKET", "schemas")
db_table = os.getenv("DB_TABLE", "event_logs")
repo_file_name = os.getenv("REPO_JSON_FILE", "repo.json")

_supabase_client: Client = None


def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client:
        return _supabase_client

    try:
        if not supabase_url or not supabase_key:
            st.error("Supabase configuration missing. Check SUPABASE_URL and SUPABASE_SERVICE_KEY.")
            return None
        _supabase_client = create_client(supabase_url, supabase_key)
    except Exception as e:
        st.error(f"Supabase Init Error: {e}")
        print(f"Warning: Could not initialize Supabase client: {e}")
        return None

    return _supabase_client


def upload_json(data, destination_blob_name, silent=False):
    """Upload JSON data to Supabase Storage"""
    client = get_supabase_client()
    if not client:
        if not silent:
            st.error("Supabase not initialized (check credentials)")
        return False

    try:
        json_bytes = json.dumps(data).encode('utf-8')
        
        client.storage.from_(storage_bucket).upload(
            path=destination_blob_name,
            file=json_bytes,
            file_options={"content-type": "application/json", "upsert": "true"}
        )
        
        if not silent:
            st.success("Upload completed successfully!")
        return True
    except Exception as e:
        if not silent:
            st.error(f"Upload failed: {str(e)}")
        return False


def download_json(blob_name):
    """Download JSON from Supabase Storage"""
    client = get_supabase_client()
    if not client:
        return None

    try:
        response = client.storage.from_(storage_bucket).download(blob_name)
        return json.loads(response.decode('utf-8'))
    except Exception as e:
        print(f"Download error for {blob_name}: {e}")
        return None


def list_blobs(prefix=""):
    """List all blobs in storage bucket"""
    client = get_supabase_client()
    if not client:
        return []

    try:
        response = client.storage.from_(storage_bucket).list(prefix)
        return [item['name'] for item in response if item['name'].endswith('.json')]
    except Exception as e:
        print(f"List blobs error: {e}")
        return []


def delete_blob(blob_name):
    """Delete a blob from storage"""
    client = get_supabase_client()
    if not client:
        return False

    try:
        client.storage.from_(storage_bucket).remove([blob_name])
        return True
    except Exception as e:
        print(f"Delete error: {e}")
        return False


def fetch_logs(start_date, end_date):
    """Fetch validation logs from Supabase database"""
    client = get_supabase_client()
    if not client:
        return []

    try:
        response = client.table(db_table).select("*").gte(
            "timestamp", start_date.isoformat()
        ).lte(
            "timestamp", end_date.isoformat()
        ).execute()
        
        return response.data
    except Exception as e:
        st.error(f"Error fetching logs: {e}")
        return []


def get_repo_json():
    """Get the parameter repository JSON"""
    return download_json(repo_file_name)


def save_repo_json(data):
    """Save the parameter repository JSON"""
    return upload_json(data, repo_file_name, silent=True)
