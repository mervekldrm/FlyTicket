const Ticket = require('../models/Ticket');
const Flight = require('../models/Flight');

exports.bookTicket = async (req, res) => {
  try {
    const { ticket_id, passenger_name, passenger_surname, passenger_email, flight_id, seat_number } = req.body;

    // Uçuşun mevcut olup olmadığını kontrol et
    const flight = await Flight.findById(flight_id);
    if (!flight) return res.status(404).json({ message: 'Uçuş bulunamadı' });

    // Koltuk var mı kontrolü (isteğe bağlı)
    if (flight.seats_available <= 0) {
      return res.status(400).json({ message: 'Uçuşta boş koltuk kalmamış' });
    }

    // Yeni bilet oluştur
    const newTicket = new Ticket({
      ticket_id,
      passenger_name,
      passenger_surname,
      passenger_email,
      flight_id,
      seat_number
    });

    await newTicket.save();

    // Uçuşta boş koltuk sayısını azalt
    flight.seats_available -= 1;
    await flight.save();

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: 'Bilet rezervasyonu başarısız', error });
  }
};

exports.getTicketsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const tickets = await Ticket.find({ passenger_email: email }).populate('flight_id');
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Biletler getirilirken hata oluştu', error });
  }
};
