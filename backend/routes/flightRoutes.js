const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm uçuşları listele (herkes erişebilir)
router.get('/', flightController.getAllFlights);

// Yeni uçuş ekle (sadece yetkili erişim)
router.post('/', authMiddleware, flightController.createFlight);

// Uçuş güncelle (sadece yetkili erişim)
router.put('/:id', authMiddleware, flightController.updateFlight);

// Uçuş sil (sadece yetkili erişim)
router.delete('/:id', authMiddleware, flightController.deleteFlight);

module.exports = router;
