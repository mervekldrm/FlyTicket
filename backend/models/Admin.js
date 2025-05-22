const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }  // hashlenmiş olabilir, ama basit metin de olur
});

module.exports = mongoose.model('Admin', adminSchema, 'admin');
