// backend/src/controllers/ticketController.js
const Ticket = require('../models/ticketModel');
const Flight = require('../models/flightModel');

// Bilet rezervasyonu yap
exports.bookTicket = async (req, res) => {
    const { passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = req.body;

    try {
        const flight = await Flight.findById(flight_id);

        if (!flight) {
            return res.status(404).json({ message: 'Flight not found.' });
        }

        if (flight.seats_available <= 0) {
            return res.status(400).json({ message: 'No available seats on this flight.' });
        }

        // TODO: Eğer seat_number gönderilirse, bu koltuğun müsait olup olmadığını kontrol et. (Bonus Feature) [cite: 12]

        const ticket_id = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const ticket = await Ticket.create({
            ticket_id,
            passenger_name,
            passenger_surname,
            passenger_email,
            flight_id,
            seat_number: seat_number || null, // Eğer seat_number boş gelirse null olarak kaydet
        });

        // Mevcut koltuk sayısını azalt
        flight.seats_available -= 1;
        await flight.save();

        // Yanıtı dönerken bileti ve populate edilmiş uçuş bilgilerini de döndürebiliriz
        // Bu, frontend'in confirmation sayfasında kullanmak için daha iyi olur.
        const populatedTicket = await Ticket.findById(ticket._id)
            .populate({
                path: 'flight_id',
                populate: [
                    { path: 'from_city', select: 'city_name' }, // from_city'yi populate et ve sadece city_name'i seç
                    { path: 'to_city', select: 'city_name' }   // to_city'yi populate et ve sadece city_name'i seç
                ]
            });

        res.status(201).json({ message: 'Ticket booked successfully!', ticket: populatedTicket });
    } catch (error) {
        console.error("Bilet rezervasyonu hatası:", error);
        res.status(400).json({ message: error.message });
    }
};

// Kullanıcının biletlerini email ile listele [cite: 14]
exports.getTicketsByEmail = async (req, res) => {
    const { email } = req.params;
    try {
        const tickets = await Ticket.find({ passenger_email: email })
            .populate({
                path: 'flight_id',
                // Uçuş içindeki from_city ve to_city'yi de populate et
                populate: [
                    { path: 'from_city', select: 'city_name' },
                    { path: 'to_city', select: 'city_name' }
                ]
            });
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Email ile bilet alma hatası:", error);
        res.status(500).json({ message: error.message });
    }
};

// Tüm biletleri getir (Admin only) [cite: 2]
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({})
            .populate({
                path: 'flight_id',
                // Uçuş içindeki from_city ve to_city'yi de populate et
                populate: [
                    { path: 'from_city', select: 'city_name' },
                    { path: 'to_city', select: 'city_name' }
                ]
            });
        res.status(200).json(tickets);
    } catch (error) {
        console.error("Tüm biletleri alma hatası:", error);
        res.status(500).json({ message: error.message });
    }
};

// Yeni eklenen getTicketById fonksiyonu (eğer kullanılıyorsa)
exports.getTicketById = async (req, res) => {
    const { ticketId } = req.params;
    try {
        const ticket = await Ticket.findOne({ ticket_id: ticketId })
            .populate({
                path: 'flight_id',
                populate: [
                    { path: 'from_city', select: 'city_name' },
                    { path: 'to_city', select: 'city_name' }
                ]
            });
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        console.error('Error fetching ticket by ID:', error);
        res.status(500).json({ message: 'Error fetching ticket details: ' + error.message });
    }
};