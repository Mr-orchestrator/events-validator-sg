const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

const getSupabaseClient = () => {
    if (!supabase && supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
    return supabase;
};

const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'schemas';
const DB_TABLE = process.env.DB_TABLE || 'event_logs';
const logValidFieldsFlag = process.env.LOG_VALID_FIELDS === 'true';

const loadJsonFromStorage = async (fileName) => {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return null;
        }

        const { data, error } = await client.storage
            .from(STORAGE_BUCKET)
            .download(fileName);

        if (error) {
            if (error.message.includes('not found') || error.statusCode === 404) {
                console.warn(`File not found: ${fileName}`);
                return null;
            }
            throw error;
        }

        const text = await data.text();
        return JSON.parse(text);
    } catch (err) {
        console.error(`Error loading ${fileName}:`, err.message);
        return null;
    }
};

async function logEventsToDatabase(logs) {
    if (!logs || logs.length === 0) {
        console.log('No logs to insert');
        return;
    }

    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return;
        }

        const { error } = await client
            .from(DB_TABLE)
            .insert(logs);

        if (error) {
            console.error('ERROR inserting logs:', error);
            return;
        }

        const fieldsFlag = logs[0].hasOwnProperty('field');
        const logType = fieldsFlag
            ? `${logs.length} ${logs[0].status === 'valid' ? 'valid' : 'invalid'} fields`
            : `${logs.length} ${logs[0].status === 'valid' ? 'valid' : 'invalid'} event(s)`;
        
        console.log(`Logged ${logType} to ${DB_TABLE}`);
    } catch (err) {
        console.error('Database insert error:', err);
    }

    console.log('LOG_VALID_FIELDS is set to:', logValidFieldsFlag);
}

async function uploadJsonToStorage(data, fileName) {
    try {
        const client = getSupabaseClient();
        if (!client) {
            console.error('Supabase client not initialized');
            return false;
        }

        const { error } = await client.storage
            .from(STORAGE_BUCKET)
            .upload(fileName, JSON.stringify(data), {
                contentType: 'application/json',
                upsert: true
            });

        if (error) {
            console.error('Upload error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Storage upload error:', err);
        return false;
    }
}

module.exports = {
    getSupabaseClient,
    loadJsonFromStorage,
    logEventsToDatabase,
    uploadJsonToStorage,
    logValidFieldsFlag,
    STORAGE_BUCKET,
    DB_TABLE
};
