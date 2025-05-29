import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTicketById } from '../api/api'; // Changed from getTicketsByEmail

function BookingConfirmationPage() {
    const { ticketId } = useParams();
    const [ticketDetails, setTicketDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTicketDetails = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getTicketById(ticketId); // Use the new function
                setTicketDetails(response.data);
            } catch (err) {
                console.error("Failed to fetch ticket details", err);
                setError(err.response?.data?.message || 'Failed to load ticket details.');
            } finally {
                setLoading(false);
            }
        };

        if (ticketId) {
            fetchTicketDetails();
        }
    }, [ticketId]);

    if (loading) {
        return <div className="text-center text-xl mt-8">Rezervasyon detayları yükleniyor...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center text-xl mt-8">{error}</div>;
    }

    if (!ticketDetails) {
        return <div className="text-center text-xl mt-8">Bilet bulunamadı.</div>;
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-green-600">Rezervasyon Onayı</h1>
            <p className="text-green-500 text-6xl mb-6">✅</p> {/* "Success" badge [cite: 15] */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-4">Bilet Detayları [cite: 15]</h2>
                <p className="text-lg"><strong>Bilet ID:</strong> {ticketDetails.ticket_id}</p>
                <p className="text-lg"><strong>Yolcu Adı:</strong> {ticketDetails.passenger_name} {ticketDetails.passenger_surname}</p>
                <p className="text-lg"><strong>Yolcu Email:</strong> {ticketDetails.passenger_email}</p>
                {ticketDetails.seat_number && <p className="text-lg"><strong>Koltuk No:</strong> {ticketDetails.seat_number}</p>}
            </div>

            <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Uçuş Bilgileri [cite: 15]</h3>
                <p className="text-lg"><strong>Uçuş:</strong> {ticketDetails.flight_id.from_city.city_name} &rarr; {ticketDetails.flight_id.to_city.city_name}</p>
                <p className="text-lg"><strong>Kalkış:</strong> {new Date(ticketDetails.flight_id.departure_time).toLocaleString()}</p>
                <p className="text-lg"><strong>Varış:</strong> {new Date(ticketDetails.flight_id.arrival_time).toLocaleString()}</p>
                <p className="text-lg"><strong>Fiyat:</strong> {ticketDetails.flight_id.price} TL</p>
            </div>
            {/* <button className="mt-6 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                E-Bilet İndir (Bonus Feature) [cite: 15]
            </button> */}
        </div>
    );
}

export default BookingConfirmationPage;
