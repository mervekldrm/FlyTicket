import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/flights')
      .then(res => {
        setFlights(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Uçuşlar yüklenirken hata oluştu');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: 'auto', paddingTop: '20px' }}>
      <h2>Admin Dashboard - Uçuş Yönetimi</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Flight ID</th>
            <th>From</th>
            <th>To</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Price</th>
            <th>Seats Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flights.map(flight => (
            <tr key={flight._id}>
              <td>{flight.flight_id}</td>
              <td>{flight.from_city.city_name}</td>
              <td>{flight.to_city.city_name}</td>
              <td>{new Date(flight.departure_time).toLocaleString()}</td>
              <td>{new Date(flight.arrival_time).toLocaleString()}</td>
              <td>{flight.price}</td>
              <td>{flight.seats_available}</td>
              <td>
                {/* Düzenle ve Sil butonları buraya gelecek */}
                <button disabled>Düzenle</button> 
                <button disabled>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Yeni uçuş ekleme butonu buraya gelecek */}
      <button disabled style={{ marginTop: '15px' }}>Yeni Uçuş Ekle</button>
    </div>
  );
}
