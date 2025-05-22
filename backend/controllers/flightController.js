const Flight = require('../models/Flight');

// Tüm uçuşları getir
exports.getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find().populate('from_city to_city');
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: 'Uçuşlar getirilirken hata oluştu', error });
  }
};

// Yeni uçuş oluştur
exports.createFlight = async (req, res) => {
  try {
    const flightData = req.body;

    // Aynı şehirden aynı saatte kalkış kontrolü
    const existingFromFlight = await Flight.findOne({
      from_city: flightData.from_city,
      departure_time: flightData.departure_time
    });
    if (existingFromFlight) {
      return res.status(400).json({ message: 'Aynı şehirden aynı saatte başka bir uçuş zaten var.' });
    }

    // Aynı şehre aynı saatte varış kontrolü
    const existingToFlight = await Flight.findOne({
      to_city: flightData.to_city,
      arrival_time: flightData.arrival_time
    });
    if (existingToFlight) {
      return res.status(400).json({ message: 'Aynı şehre aynı saatte başka bir uçuş var.' });
    }

    const newFlight = new Flight(flightData);
    await newFlight.save();
    res.status(201).json(newFlight);
  } catch (error) {
    res.status(400).json({ message: 'Uçuş oluşturulurken hata', error });
  }
};

// Uçuşu güncelle
exports.updateFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const updates = req.body;

    // Güncellemede de aynı kurallar geçerli olabilir (opsiyonel)
    // Buraya ekleyebilirsin

    const updatedFlight = await Flight.findByIdAndUpdate(flightId, updates, { new: true });
    if (!updatedFlight) return res.status(404).json({ message: 'Uçuş bulunamadı' });

    res.json(updatedFlight);
  } catch (error) {
    res.status(400).json({ message: 'Uçuş güncellenirken hata', error });
  }
};

// Uçuşu sil
exports.deleteFlight = async (req, res) => {
  try {
    const flightId = req.params.id;
    const deletedFlight = await Flight.findByIdAndDelete(flightId);

    if (!deletedFlight) return res.status(404).json({ message: 'Uçuş bulunamadı' });

    res.json({ message: 'Uçuş silindi' });
  } catch (error) {
    res.status(400).json({ message: 'Uçuş silinirken hata', error });
  }
};
