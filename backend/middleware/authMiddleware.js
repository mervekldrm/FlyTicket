function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Yetkisiz erişim' });
    // Burada token doğrulama işlemi yapılacak (isteğe bağlı)
    next();
  }
  
  module.exports = authMiddleware;
  