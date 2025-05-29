const City = require('../models/cityModel');

// Tüm şehirleri getir
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.status(200).json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni şehir ekle (sadece admin)
exports.createCity = async (req, res) => {
    const { city_id, city_name } = req.body;
    try {
        const city = await City.create({ city_id, city_name });
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// ... Diğer CRUD işlemleri (update, delete) eklenebilir