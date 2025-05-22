import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cities = [ /* 81 ilin isimleri, örnek */ 
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', /* ... devamı */ 'Düzce'
];

function FlightSearch() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [date, setDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Uçuşları API'den çekmek için fonksiyon
  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    try {
      // Örnek API çağrısı: GET /flights?from=fromCity&to=toCity&date=date
      const query = new URLSearchParams();
      if (fromCity) query.append('from', fromCity);
      if (toCity) query.append('to', toCity);
      if (date) query.append('date', date);

      const res = await fetch(`/api/flights?${query.toString()}`);
      if (!res.ok) throw new Error('Uçuşlar yüklenirken hata oluştu.');
      const data = await res.json();
      setFlights(data);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFlights();
  };

  return (
    <div className="flight-search-container">
      <h1>FlyTicket - Uçuş Arama</h1>
      <form onSubmit={handleSearch}>
        <label>
          Kalkış Şehri:
          <select value={fromCity} onChange={e => setFromCity(e.target.value)} required>
            <option value="">Seçiniz</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label>
          Varış Şehri:
          <select value={toCity} onChange={e => setToCity(e.target.value)} required>
            <option value="">Seçiniz</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </label>
        <label>
          Tarih:
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </label>
        <button type="submit">Uçuşları Ara</button>
      </form>

      {loading && <p>Yükleniyor...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="flights-list">
        {flights.length === 0 && !loading && <p>Uçuş bulunamadı.</p>}
        {flights.map(flight => (
          <div key={flight.flight_id} className="flight-card">
            <p><strong>{flight.from_city} → {flight.to_city}</strong></p>
            <p>Kalkış: {new Date(flight.departure_time).toLocaleString()}</p>
            <p>Varış: {new Date(flight.arrival_time).toLocaleString()}</p>
            <p>Fiyat: ₺{flight.price}</p>
            <p>Boş Koltuk: {flight.seats_available}</p>
            <button onClick={() => navigate(`/flight/${flight.flight_id}`)}>
              Rezervasyon Yap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FlightSearch;
