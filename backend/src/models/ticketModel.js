const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    ticket_id: {
        type: String,
        required: true,
        unique: true,
    },
    passenger_name: {
        type: String,
        required: true,
    },
    passenger_surname: {
        type: String,
        required: true,
    },
    passenger_email: {
        type: String,
        required: true,
    },
    flight_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true,
    },
    seat_number: {
        type: String,
        // required: false, // Optional
    },
    booking_date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Ticket', TicketSchema);