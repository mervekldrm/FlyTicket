const Admin = require('../models/Admin');

exports.login = async (req, res) => {
    console.log('Login isteği geldi:', req.body);
  
    const { username, password } = req.body;
    try {
      const admin = await Admin.findOne({ username });
      console.log('Bulunan admin:', admin);
  
      if (!admin) return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
  
      if (admin.password !== password) {
        return res.status(401).json({ message: 'Şifre yanlış' });
      }
  
      res.json({ message: 'Giriş başarılı' });
    } catch (err) {
      console.error('Login hatası:', err);
      res.status(500).json({ message: 'Sunucu hatası', error: err.message });
    }
  };
  