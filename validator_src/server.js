require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { validateEvent } = require('./index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Events Validator - SG opensource</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
        h1 { color: #00d4ff; }
        .endpoint { background: #16213e; padding: 15px; margin: 10px 0; border-radius: 8px; }
        code { background: #0f3460; padding: 3px 8px; border-radius: 4px; color: #00d4ff; }
        a { color: #00d4ff; }
    </style>
</head>
<body>
    <h1>🚀 Events Validator API</h1>
    <p><strong>SG opensource</strong> - Free Cloud Edition v2.0.0</p>
    <h2>Endpoints</h2>
    <div class="endpoint"><code>GET /health</code> - Health check</div>
    <div class="endpoint"><code>POST /api/validate</code> - Validate events</div>
    <h2>Links</h2>
    <p><a href="https://github.com/Mr-orchestrator/events-validator-sg">📖 Documentation</a></p>
    <p>✅ Status: <strong style="color: #00ff88;">Online</strong></p>
</body>
</html>
    `);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'events-validator-sg' });
});

app.post('/api/validate', validateEvent);
app.post('/eventsValidator', validateEvent);

app.listen(PORT, () => {
    console.log(`Events Validator (SG opensource) running on port ${PORT}`);
});

module.exports = app;
