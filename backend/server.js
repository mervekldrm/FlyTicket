require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { createInitialAdmin } = require('./src/controllers/adminController'); // İlk admin oluşturmak için

const PORT = process.env.PORT || 5000;

// Veritabanı bağlantısı
connectDB();

// İlk admin hesabını oluştur
createInitialAdmin();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});