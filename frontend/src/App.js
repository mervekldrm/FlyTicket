import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FlightDetailPage from './pages/FlightDetailPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminFlightForm from './pages/AdminFlightForm';
import AdminLogin from './pages/AdminLogin';
import Header from './components/Header';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext'; // AuthProvider'ı import et
import './App.css'; // CSS dosyasını import et
import './index.css'; // Tailwind CSS dosyasını import et

function App() {
    return (
        <Router>
            <AuthProvider> {/* Tüm uygulamayı AuthProvider ile sarmala */}
              <div className="flex flex-col min-h-screen"> {/* Wrapper div for flex layout */}
                <Header />
                <main className="container mx-auto p-4 flex-grow"> {/* Added flex-grow */}
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/flight/:id" element={<FlightDetailPage />} />
                        <Route path="/confirmation/:ticketId" element={<BookingConfirmationPage />} />
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/flights/new" element={<AdminFlightForm />} />
                        <Route path="/admin/flights/edit/:id" element={<AdminFlightForm />} />
                    </Routes>
                </main>
                <Footer />
              </div> {/* Closing tag for the wrapper div */}
            </AuthProvider>
        </Router>
    );
}

export default App;