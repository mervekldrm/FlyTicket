const Flight = require('../models/flightModel');
const City = require('../models/cityModel');
const Ticket = require('../models/ticketModel'); // Import Ticket model

// Tüm uçuşları getir
exports.getAllFlights = async (req, res) => {
    try {
        const flights = await Flight.find({})
            .populate('from_city', 'city_name')
            .populate('to_city', 'city_name');
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Uçuş ara [cite: 2]
exports.searchFlights = async (req, res) => {
    const { from, to, date } = req.query; // origin, destination, date
    try {
        let query = {};
        if (from) {
            const fromCity = await City.findOne({ city_name: { $regex: new RegExp(`^${from}$`, 'i') } });
            if (fromCity) query.from_city = fromCity._id;
            else return res.status(404).json({ message: 'Origin city not found.' });
        }
        if (to) {
            const toCity = await City.findOne({ city_name: { $regex: new RegExp(`^${to}$`, 'i') } });
            if (toCity) query.to_city = toCity._id;
            else return res.status(404).json({ message: 'Destination city not found.' });
        }
        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(searchDate);
            nextDay.setDate(searchDate.getDate() + 1);

            query.departure_time = {
                $gte: searchDate.toISOString().split('T')[0], // Başlangıç günü
                $lt: nextDay.toISOString().split('T')[0], // Ertesi günün başlangıcı
            };
        }

        const flights = await Flight.find(query)
            .populate('from_city', 'city_name')
            .populate('to_city', 'city_name');
        res.status(200).json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Yeni uçuş oluştur (Admin only) [cite: 14]
exports.createFlight = async (req, res) => {
    const { flight_id, from_city_name, to_city_name, departure_time, arrival_time, price, seats_total } = req.body;

    try {
        const fromCity = await City.findOne({ city_name: from_city_name });
        const toCity = await City.findOne({ city_name: to_city_name });

        if (!fromCity || !toCity) {
            return res.status(400).json({ message: 'Origin or destination city not found.' });
        }

        // Kural 2: Aynı şehirden aynı saatte iki uçuş kalkamaz [cite: 5, 6]
        const existingDepartureFlight = await Flight.findOne({
            from_city: fromCity._id,
            departure_time: {
                $gte: new Date(departure_time).setMinutes(0, 0, 0), // Saat başı
                $lt: new Date(departure_time).setMinutes(59, 59, 999), // Saatin sonu
            },
        });

        if (existingDepartureFlight) {
            return res.status(400).json({ message: 'Another flight departs from this city at the same hour.' }); // [cite: 5, 6]
        }

        // Kural 3: Aynı şehre aynı varış saatinde iki uçuş varamaz [cite: 7, 8]
        const existingArrivalFlight = await Flight.findOne({
            to_city: toCity._id,
            arrival_time: {
                $gte: new Date(arrival_time).setMinutes(0, 0, 0),
                $lt: new Date(arrival_time).setMinutes(59, 59, 999),
            },
        });

        if (existingArrivalFlight) {
            return res.status(400).json({ message: 'Another flight arrives at this city at the same arrival hour.' }); // [cite: 7, 8]
        }

        const flight = await Flight.create({
            flight_id,
            from_city: fromCity._id,
            to_city: toCity._id,
            departure_time,
            arrival_time,
            price,
            seats_total,
            seats_available: seats_total, // Başlangıçta tüm koltuklar müsait
        });
        res.status(201).json(flight);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Uçuş güncelle (Admin only) [cite: 14]
exports.updateFlight = async (req, res) => {
    const { id } = req.params;
    const { from_city_name, to_city_name, departure_time, arrival_time, price, seats_total, seats_available } = req.body;

    try {
        let updateFields = req.body;

        if (from_city_name) {
            const fromCity = await City.findOne({ city_name: from_city_name });
            if (!fromCity) return res.status(400).json({ message: 'Origin city not found.' });
            updateFields.from_city = fromCity._id;
        }
        if (to_city_name) {
            const toCity = await City.findOne({ city_name: to_city_name });
            if (!toCity) return res.status(400).json({ message: 'Destination city not found.' });
            updateFields.to_city = toCity._id;
        }

        // Kural 2 ve 3 doğrulamasını burada da yapmalısın.
        // Eğer departure_time veya arrival_time güncelleniyorsa, ilgili kuralı kontrol et.
        if (departure_time || from_city_name) {
            const currentFlight = await Flight.findById(id);
            const newFromCity = from_city_name ? (await City.findOne({ city_name: from_city_name }))._id : currentFlight.from_city;
            const newDepartureTime = departure_time || currentFlight.departure_time;

            const existingDepartureFlight = await Flight.findOne({
                _id: { $ne: id }, // Kendi uçuşunu hariç tut
                from_city: newFromCity,
                departure_time: {
                    $gte: new Date(newDepartureTime).setMinutes(0, 0, 0),
                    $lt: new Date(newDepartureTime).setMinutes(59, 59, 999),
                },
            });
            if (existingDepartureFlight) {
                return res.status(400).json({ message: 'Another flight departs from this city at the same hour.' });
            }
        }

        if (arrival_time || to_city_name) {
            const currentFlight = await Flight.findById(id);
            const newToCity = to_city_name ? (await City.findOne({ city_name: to_city_name }))._id : currentFlight.to_city;
            const newArrivalTime = arrival_time || currentFlight.arrival_time;

            const existingArrivalFlight = await Flight.findOne({
                _id: { $ne: id }, // Kendi uçuşunu hariç tut
                to_city: newToCity,
                arrival_time: {
                    $gte: new Date(newArrivalTime).setMinutes(0, 0, 0),
                    $lt: new Date(newArrivalTime).setMinutes(59, 59, 999),
                },
            });
            if (existingArrivalFlight) {
                return res.status(400).json({ message: 'Another flight arrives at this city at the same arrival hour.' });
            }
        }

        const flight = await Flight.findByIdAndUpdate(id, updateFields, { new: true });
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json(flight);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Uçuş sil (Admin only) [cite: 14]
exports.deleteFlight = async (req, res) => {
    const { id } = req.params;
    try {
        const flight = await Flight.findByIdAndDelete(id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }
        res.status(200).json({ message: 'Flight deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get occupied seats for a specific flight
exports.getOccupiedSeatsForFlight = async (req, res) => {
    const { flightId } = req.params;
    try {
        // Find all tickets for the given flightId that have a seat_number
        const tickets = await Ticket.find({ flight_id: flightId, seat_number: { $ne: null, $ne: '' } });
        const occupiedSeats = tickets.map(ticket => ticket.seat_number);
        res.status(200).json(occupiedSeats);
    } catch (error) {
        console.error('Error fetching occupied seats:', error);
        res.status(500).json({ message: 'Failed to fetch occupied seats: ' + error.message });
    }
};