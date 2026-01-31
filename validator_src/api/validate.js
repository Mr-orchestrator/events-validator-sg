const { validateEvent } = require('../index.js');

module.exports = (req, res) => {
    if (req.method === 'POST') {
        return validateEvent(req, res);
    }
    res.status(405).json({ error: 'Method not allowed' });
};
