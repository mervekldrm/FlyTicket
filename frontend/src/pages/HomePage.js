import React, { useState, useEffect } from 'react';
import { getCities, searchFlights } from '../api/api';
import { Link } from 'react-router-dom';
import FlightCard from '../components/FlightCard';

function HomePage() {
    const [cities, setCities] = useState([]);
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [date, setDate] = useState('');
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getCities();
                setCities(response.data);
            } catch (err) {
                console.error("Failed to fetch cities", err);
                setError('Failed to load cities.');
            }
        };
        fetchCities();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await searchFlights({ from: fromCity, to: toCity, date });
            setFlights(response.data);
        } catch (err) {
            console.error("Failed to search flights", err);
            setError(err.response?.data?.message || 'Failed to search flights.');
            setFlights([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">FlyTicket - Uçuş Ara</h1>
            <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label htmlFor="from" className="block text-gray-700 text-sm font-bold mb-2">
                            Kalkış Şehri:
                        </label>
                        <select
                            id="from"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={fromCity}
                            onChange={(e) => setFromCity(e.target.value)}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={city.city_name}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="to" className="block text-gray-700 text-sm font-bold mb-2">
                            Varış Şehri:
                        </label>
                        <select
                            id="to"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={toCity}
                            onChange={(e) => setToCity(e.target.value)}
                            required
                        >
                            <option value="">Seçiniz</option>
                            {cities.map((city) => (
                                <option key={city.city_id} value={city.city_name}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">
                            Tarih:
                        </label>
                        <input
                            type="date"
                            id="date"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Aranıyor...' : 'Uçuş Ara'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="flight-results">
                {flights.length === 0 && !loading && !error && <p className="text-center text-gray-600">Lütfen uçuş arayın.</p>}
                {flights.length > 0 && (
                    // Buradaki başlık da modern arayüz görünümüne uygun hale getirilebilir.
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Mevcut Uçuşlar</h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Her bir uçuş için FlightCard bileşenini kullan */}
                    {flights.map((flight) => (
                        <FlightCard key={flight._id} flight={flight} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HomePage;