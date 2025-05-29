import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Axios interceptor ile token ekleme
API.interceptors.request.use((config) => {
    const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
    if (adminInfo && adminInfo.token) {
        config.headers.Authorization = `Bearer ${adminInfo.token}`;
    }
    return config;
});

export const getCities = () => API.get('/api/cities');
export const getFlights = () => API.get('/api/flights');
export const searchFlights = (params) => API.get('/api/flights/search', { params });
export const bookTicket = (ticketData) => API.post('/api/tickets', ticketData);
export const getTicketsByEmail = (email) => API.get(`/api/tickets/${email}`);
export const getTicketById = (ticketId) => API.get(`/api/tickets/id/${ticketId}`); // New function to get ticket by ID
export const getOccupiedSeats = (flightId) => API.get(`/api/flights/${flightId}/occupied-seats`); // New function to get occupied seats

// Admin API'leri
export const adminLogin = (credentials) => API.post('/api/admin/login', credentials);
export const createFlight = (flightData) => API.post('/api/flights', flightData);
export const updateFlight = (id, flightData) => API.put(`/api/flights/${id}`, flightData);
export const deleteFlight = (id) => API.delete(`/api/flights/${id}`);
export const getAllBookings = () => API.get('/api/tickets');