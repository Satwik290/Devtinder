const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: { type: String, required: true, unique: true },
  password: String,
});

module.exports = mongoose.model('User', userSchema);
