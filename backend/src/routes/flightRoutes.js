const express = require('express');
const { getAllFlights, searchFlights, createFlight, updateFlight, deleteFlight, getOccupiedSeatsForFlight } = require('../controllers/flightController'); // Added getOccupiedSeatsForFlight
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/:flightId/occupied-seats', getOccupiedSeatsForFlight); // New route for occupied seats
router.post('/', protect, createFlight); // Admin only [cite: 14]
router.put('/:id', protect, updateFlight); // Admin only [cite: 14]
router.delete('/:id', protect, deleteFlight); // Admin only [cite: 14]

module.exports = router;