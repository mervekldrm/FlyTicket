import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [adminInfo, setAdminInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAdminInfo = localStorage.getItem('adminInfo');
        if (storedAdminInfo) {
            setAdminInfo(JSON.parse(storedAdminInfo));
        }
    }, []);

    const login = (data) => {
        setAdminInfo(data);
        localStorage.setItem('adminInfo', JSON.stringify(data));
        navigate('/admin/dashboard');
    };

    const logout = () => {
        setAdminInfo(null);
        localStorage.removeItem('adminInfo');
        navigate('/admin/login');
    };

    return (
        <AuthContext.Provider value={{ adminInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};