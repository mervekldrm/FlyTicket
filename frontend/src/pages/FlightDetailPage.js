import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFlights, bookTicket, getOccupiedSeats } from '../api/api'; // Added getOccupiedSeats
import SeatSelector from '../components/SeatSelector'; // Import SeatSelector

function FlightDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [flight, setFlight] = useState(null);
    const [passengerName, setPassengerName] = useState('');
    const [passengerSurname, setPassengerSurname] = useState('');
    const [passengerEmail, setPassengerEmail] = useState('');
    const [selectedSeat, setSelectedSeat] = useState(''); // State for selected seat
    const [occupiedSeats, setOccupiedSeats] = useState([]); // State for occupied seats
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFlightAndSeats = async () => {
            try {
                // Fetch flight details
                const flightResponse = await getFlights(); 
                const foundFlight = flightResponse.data.find(f => f._id === id);
                if (foundFlight) {
                    setFlight(foundFlight);
                    // Fetch occupied seats for this flight
                    const seatsResponse = await getOccupiedSeats(foundFlight._id);
                    setOccupiedSeats(seatsResponse.data);
                } else {
                    setError('Flight not found.');
                }
            } catch (err) {
                console.error("Failed to fetch flight details or seats", err);
                setError('Failed to load flight details or seat information.');
            }
        };
        fetchFlightAndSeats();
    }, [id]);

    const handleSeatSelect = (seatNumber) => {
        setSelectedSeat(seatNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!flight || flight.seats_available <= 0) {
            setError('No seats available or flight not found.');
            setLoading(false);
            return;
        }

        const ticketData = {
            passenger_name: passengerName,
            passenger_surname: passengerSurname,
            passenger_email: passengerEmail,
            flight_id: flight._id,
            seat_number: selectedSeat, // Use selectedSeat from state
        };

        try {
            const response = await bookTicket(ticketData);
            navigate(`/confirmation/${response.data.ticket.ticket_id}`);
        } catch (err) {
            console.error("Failed to book ticket", err);
            setError(err.response?.data?.message || 'Failed to book ticket.');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="text-red-500 text-center text-xl mt-8">{error}</div>;
    }

    if (!flight) {
        return <div className="text-center text-xl mt-8">Uçuş bilgileri yükleniyor...</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Uçuş Detayları ve Bilet Rezervasyonu</h1>
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">{flight.from_city.city_name} &rarr; {flight.to_city.city_name}</h2>
                <p className="text-gray-700">Kalkış: {new Date(flight.departure_time).toLocaleString()}</p>
                <p className="text-gray-700">Varış: {new Date(flight.arrival_time).toLocaleString()}</p>
                <p className="text-xl font-bold text-green-600 my-2">Fiyat: {flight.price} TL</p>
                <p className="text-gray-700">Müsait Koltuk: {flight.seats_available}</p>
            </div>

            <form onSubmit={handleSubmit} className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Yolcu Bilgileri</h3>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Ad:</label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="surname" className="block text-gray-700 text-sm font-bold mb-2">Soyad:</label>
                    <input
                        type="text"
                        id="surname"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={passengerSurname}
                        onChange={(e) => setPassengerSurname(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={passengerEmail}
                        onChange={(e) => setPassengerEmail(e.target.value)}
                        required
                    />
                </div>
                {/* Seat Selector Component */}
                {flight && flight.seats_total > 0 && (
                    <div className="mb-4">
                        <SeatSelector 
                            totalSeats={flight.seats_total}
                            occupiedSeats={occupiedSeats}
                            selectedSeat={selectedSeat}
                            onSeatSelect={handleSeatSelect}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={loading || flight.seats_available <= 0}
                >
                    {loading ? 'Rezerve Ediliyor...' : 'Bilet Ayırt'}
                </button>
            </form>
        </div>
    );
}

export default FlightDetailPage;