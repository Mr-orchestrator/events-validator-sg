require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { validateEvent } = require('./index.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        service: 'Events Validator - SG opensource',
        version: '2.0.0',
        endpoints: {
            health: 'GET /health',
            validate: 'POST /api/validate'
        },
        docs: 'https://github.com/Mr-orchestrator/events-validator-sg'
    });
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
