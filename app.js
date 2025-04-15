const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => { 
  try {

    const user = new User(req.body);
    const saved = await user.save();
    res.send('User created successfully!');
    // res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
