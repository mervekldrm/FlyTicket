const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Flight route'u import et
const flightRoutes = require('./routes/flightRoutes');

// Flight route'u kullan
app.use('/api/flights', flightRoutes);

const ticketRoutes = require('./routes/ticketRoutes');

app.use('/api/tickets', ticketRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);


// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error('MongoDB bağlantı hatası:', err));


// Basit test endpoint
app.get('/', (req, res) => {
  res.send('FlyTicket Backend çalışıyor!');
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portunda çalışıyor`);
});
