import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-gray-800 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">FlyTicket</Link>
                <div>
                    <Link to="/" className="text-white hover:text-gray-300 mx-2">Anasayfa</Link>
                    <Link to="/admin/login" className="text-white hover:text-gray-300 mx-2">Admin</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;