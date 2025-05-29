import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCities, createFlight, updateFlight, getFlights } from '../api/api'; // getFlights tek uçuşu çekmek için kullanılabilir

function AdminFlightForm() {
    const { id } = useParams(); // URL'den id'yi al (düzenleme modunda)
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [flightId, setFlightId] = useState('');
    const [fromCityName, setFromCityName] = useState('');
    const [toCityName, setToCityName] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [arrivalTime, setArrivalTime] = useState('');
    const [price, setPrice] = useState('');
    const [seatsTotal, setSeatsTotal] = useState('');
    const [seatsAvailable, setSeatsAvailable] = useState(''); // Düzenleme için gerekli
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const isEditMode = !!id; // id varsa düzenleme modudur

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

        const fetchFlightDetails = async () => {
            if (isEditMode) {
                try {
                    const response = await getFlights(); // Tüm uçuşları çekip filtrelenebilir veya tek uçuşu getiren bir endpoint kullanılabilir.
                    const foundFlight = response.data.find(f => f._id === id);
                    if (foundFlight) {
                        setFlightId(foundFlight.flight_id);
                        setFromCityName(foundFlight.from_city.city_name);
                        setToCityName(foundFlight.to_city.city_name);
                        setDepartureTime(new Date(foundFlight.departure_time).toISOString().slice(0, 16));
                        setArrivalTime(new Date(foundFlight.arrival_time).toISOString().slice(0, 16));
                        setPrice(foundFlight.price);
                        setSeatsTotal(foundFlight.seats_total);
                        setSeatsAvailable(foundFlight.seats_available);
                    } else {
                        setError('Flight not found for editing.');
                    }
                } catch (err) {
                    console.error("Failed to fetch flight for editing", err);
                    setError(err.response?.data?.message || 'Failed to load flight details for editing.');
                }
            }
        };

        fetchCities();
        fetchFlightDetails();
    }, [id, isEditMode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const flightData = {
            flight_id: flightId,
            from_city_name: fromCityName,
            to_city_name: toCityName,
            departure_time: departureTime,
            arrival_time: arrivalTime,
            price: Number(price),
            seats_total: Number(seatsTotal),
            seats_available: Number(seatsAvailable) // Sadece düzenlemede gönderilecek, yeni oluşturmada otomatik ayarlanır
        };

        try {
            if (isEditMode) {
                await updateFlight(id, flightData);
                alert('Uçuş başarıyla güncellendi!');
            } else {
                await createFlight(flightData);
                alert('Uçuş başarıyla eklendi!');
            }
            navigate('/admin/dashboard');
        } catch (err) {
            console.error("Failed to save flight", err);
            setError(err.response?.data?.message || 'Uçuş kaydedilirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">{isEditMode ? 'Uçuş Düzenle' : 'Yeni Uçuş Ekle'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="flightId" className="block text-gray-700 text-sm font-bold mb-2">Uçuş ID:</label>
                    <input
                        type="text"
                        id="flightId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={flightId}
                        onChange={(e) => setFlightId(e.target.value)}
                        required
                        disabled={isEditMode} // ID düzenleme modunda değiştirilemez
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fromCity" className="block text-gray-700 text-sm font-bold mb-2">Kalkış Şehri:</label>
                    <select
                        id="fromCity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={fromCityName}
                        onChange={(e) => setFromCityName(e.target.value)}
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
                <div className="mb-4">
                    <label htmlFor="toCity" className="block text-gray-700 text-sm font-bold mb-2">Varış Şehri:</label>
                    <select
                        id="toCity"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={toCityName}
                        onChange={(e) => setToCityName(e.target.value)}
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
                <div className="mb-4">
                    <label htmlFor="departureTime" className="block text-gray-700 text-sm font-bold mb-2">Kalkış Tarih/Saat:</label>
                    <input
                        type="datetime-local"
                        id="departureTime"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={departureTime}
                        onChange={(e) => setDepartureTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="arrivalTime" className="block text-gray-700 text-sm font-bold mb-2">Varış Tarih/Saat:</label>
                    <input
                        type="datetime-local"
                        id="arrivalTime"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={arrivalTime}
                        onChange={(e) => setArrivalTime(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Fiyat:</label>
                    <input
                        type="number"
                        id="price"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        min="0"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="seatsTotal" className="block text-gray-700 text-sm font-bold mb-2">Toplam Koltuk Sayısı:</label>
                    <input
                        type="number"
                        id="seatsTotal"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={seatsTotal}
                        onChange={(e) => setSeatsTotal(e.target.value)}
                        required
                        min="1"
                    />
                </div>
                {isEditMode && (
                    <div className="mb-4">
                        <label htmlFor="seatsAvailable" className="block text-gray-700 text-sm font-bold mb-2">Müsait Koltuk Sayısı:</label>
                        <input
                            type="number"
                            id="seatsAvailable"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={seatsAvailable}
                            onChange={(e) => setSeatsAvailable(e.target.value)}
                            required
                            min="0"
                            max={seatsTotal}
                        />
                    </div>
                )}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={loading}
                    >
                        {loading ? 'Kaydediliyor...' : (isEditMode ? 'Uçuşu Güncelle' : 'Uçuş Ekle')}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        İptal
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminFlightForm;