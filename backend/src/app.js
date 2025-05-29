const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // CORS ayarları

// Rotalar
app.use('/api/cities', require('./routes/cityRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Temel rota
app.get('/', (req, res) => {
    res.send('FlyTicket API is running...');
});

module.exports = app;