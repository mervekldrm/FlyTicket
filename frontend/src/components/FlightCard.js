import React from 'react';
import { Link } from 'react-router-dom';

function FlightCard({ flight }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{flight.from_city.city_name}</h3>
                    <span className="text-4xl text-blue-500 mx-4">✈️</span>
                    <h3 className="text-2xl font-bold text-gray-800">{flight.to_city.city_name}</h3>
                </div>
                <div className="text-gray-600 text-sm mb-4">
                    <p>
                        <strong className="text-gray-700">Kalkış:</strong> {new Date(flight.departure_time).toLocaleString('tr-TR', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                    <p>
                        <strong className="text-gray-700">Varış:</strong> {new Date(flight.arrival_time).toLocaleString('tr-TR', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
                <div className="flex justify-between items-end mt-auto">
                    <div>
                        <p className="text-xl font-extrabold text-green-600">
                            {flight.price} TL
                        </p>
                        <p className="text-sm text-gray-500">
                            Müsait Koltuk: <span className="font-semibold">{flight.seats_available}</span> / {flight.seats_total}
                        </p>
                    </div>
                    <Link
                        to={`/flight/${flight._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                    >
                        Bilet Al
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FlightCard;