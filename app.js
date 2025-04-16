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
// get user by email
app.get('/user', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
