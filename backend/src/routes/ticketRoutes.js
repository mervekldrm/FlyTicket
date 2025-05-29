const express = require('express');
const { bookTicket, getTicketsByEmail, getAllTickets, getTicketById } = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', bookTicket); // User can book a ticket [cite: 14]
router.get('/:email', getTicketsByEmail); // User can view their tickets [cite: 14]
router.get('/id/:ticketId', getTicketById); // New route to get ticket by its specific ID
router.get('/', protect, getAllTickets); // Admin only [cite: 2]

module.exports = router;