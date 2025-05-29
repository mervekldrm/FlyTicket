const Admin = require('../models/adminModel');
const jwt = require('jsonwebtoken');

// Token oluşturma
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Yönetici girişi [cite: 2]
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (admin && (await admin.matchPassword(password))) {
            res.status(200).json({
                _id: admin._id,
                username: admin.username,
                token: generateToken(admin._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// İlk yönetici hesabı oluşturma (sadece ilk çalıştırmada veya manuel olarak)
exports.createInitialAdmin = async () => {
    try {
        const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });
        if (adminExists) {
            console.log('Admin already exists.');
            return;
        }

        const admin = await Admin.create({
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
        });
        console.log(`Initial Admin created: ${admin.username}`);
    } catch (error) {
        console.error('Error creating initial admin:', error.message);
    }
};