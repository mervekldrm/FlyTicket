import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFlights, deleteFlight, getAllBookings } from '../api/api';
import { useAuth } from '../context/AuthContext'; // AuthContext'i import et

function AdminDashboard() {
    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loadingFlights, setLoadingFlights] = useState(true);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { adminInfo, logout } = useAuth(); // AuthContext'ten adminInfo ve logout fonksiyonunu al

    useEffect(() => {
        // adminInfo yoksa (kullanıcı giriş yapmamışsa veya token süresi bitmişse) giriş sayfasına yönlendir
        if (!adminInfo || !adminInfo.token) {
            navigate('/admin/login');
            return; // Yönlendirme sonrası fonksiyonu durdur
        }

        const fetchFlights = async () => {
            try {
                const response = await getFlights();
                setFlights(response.data);
            } catch (err) {
                console.error("Uçuşlar yüklenirken hata oluştu:", err);
                setError(err.response?.data?.message || 'Uçuşları yüklerken bir hata oluştu.');
            } finally {
                setLoadingFlights(false);
            }
        };

        const fetchBookings = async () => {
            try {
                const response = await getAllBookings();
                setBookings(response.data);
            } catch (err) {
                console.error("Rezervasyonlar yüklenirken hata oluştu:", err);
                setError(err.response?.data?.message || 'Rezervasyonları yüklerken bir hata oluştu.');
            } finally {
                setLoadingBookings(false);
            }
        };

        fetchFlights();
        fetchBookings();
    }, [navigate, adminInfo]); // adminInfo bağımlılığı eklendi, böylece adminInfo değiştiğinde fetch'ler yeniden çalışır

    const handleDeleteFlight = async (id) => {
        if (window.confirm('Bu uçuşu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
            try {
                await deleteFlight(id);
                // Uçuş silindikten sonra listeyi güncelle
                setFlights(flights.filter(flight => flight._id !== id));
                alert('Uçuş başarıyla silindi.');
            } catch (err) {
                console.error("Uçuş silinirken hata oluştu:", err);
                setError(err.response?.data?.message || 'Uçuş silinirken bir hata oluştu.');
            }
        }
    };

    const handleLogout = () => {
        logout(); // AuthContext'teki logout fonksiyonunu çağırarak admin bilgisini temizle ve yönlendir
    };

    if (error) {
        return <div className="text-red-600 text-center text-xl mt-8 p-4 bg-red-100 rounded-lg">{error}</div>;
    }

    // Yükleme durumu için daha iyi bir kullanıcı deneyimi
    if (loadingFlights || loadingBookings) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-xl text-gray-700">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-4xl font-extrabold text-gray-900">Admin Paneli</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Çıkış Yap
                </button>
            </div>

            <Link
                to="/admin/flights/new"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg inline-block mb-8 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                ➕ Yeni Uçuş Ekle
            </Link>

            {/* Uçuş Yönetimi Bölümü */}
            <div className="bg-white p-6 rounded-lg shadow-xl mb-10">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Uçuş Yönetimi</h2>
                {flights.length === 0 ? (
                    <p className="text-gray-600 text-lg text-center py-4">Henüz kayıtlı uçuş bulunmamaktadır. Yeni bir uçuş ekleyin!</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Uçuş ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Kalkış</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Varış</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Kalkış Saati</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Varış Saati</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Fiyat</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Koltuk Müsait</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Aksiyonlar</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {flights.map((flight) => (
                                    <tr key={flight._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.flight_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.from_city?.city_name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.to_city?.city_name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(flight.departure_time).toLocaleString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(flight.arrival_time).toLocaleString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.price} TL</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{flight.seats_available} / {flight.seats_total}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Link
                                                to={`/admin/flights/edit/${flight._id}`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-200"
                                            >
                                                Düzenle
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteFlight(flight._id)}
                                                className="text-red-600 hover:text-red-900 transition duration-200"
                                            >
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bilet Rezervasyonları Bölümü */}
            <div className="bg-white p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Tüm Bilet Rezervasyonları</h2>
                {bookings.length === 0 ? (
                    <p className="text-gray-600 text-lg text-center py-4">Henüz kayıtlı bilet rezervasyonu bulunmamaktadır.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Bilet ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Yolcu Adı</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Yolcu Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Uçuş (Kalkış-Varış)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Koltuk No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Rezervasyon Tarihi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.map((ticket) => (
                                    <tr key={ticket._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.ticket_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.passenger_name} {ticket.passenger_surname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.passenger_email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {ticket.flight_id ? `${ticket.flight_id.from_city?.city_name || 'N/A'} - ${ticket.flight_id.to_city?.city_name || 'N/A'}` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.seat_number || 'Belirtilmemiş'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(ticket.booking_date).toLocaleDateString('tr-TR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;