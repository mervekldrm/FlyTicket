const express = require('express');
const { getAllCities, createCity } = require('../controllers/cityController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllCities);
router.post('/', protect, createCity); // Sadece admin ekleyebilir

module.exports = router;