const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());

// input user data
app.post('/signup', async (req, res) => { 
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).send('User created successfully!');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
//get user by email
app.get('/user', async (req, res) => {
  const { email } = req.body; // Extract email from the request body
  if (!email) {
    return res.status(400).send("Email is required");
  }
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
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

//feed api
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({}, { firstname: 1, lastname: 1, email: 1 });
    res.status(200).json(users);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});
//delete user by email
app.delete('/user', async (req, res) => {
  const { email } = req.body; // Extract email from the request body
  if (!email) {
    return res.status(400).send("Email is required");
  }
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User deleted successfully!");
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

//update user by email
app.put('/user', async (req, res) => {
  const { email, firstname, lastname } = req.body; // Extract email from the request body
  if (!email) {
    return res.status(400).send("Email is required");
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { firstname, lastname },
      { new: true } // Return the updated document
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

//update user by email (partial update)
app.patch('/user', async (req, res) => {
  const { email, firstname, lastname } = req.body; // Extract email and fields to update from the request body
  if (!email) {
    return res.status(400).send("Email is required");
  }
  try {
    const updateFields = {};
    if (firstname) updateFields.firstname = firstname;
    if (lastname) updateFields.lastname = lastname;

    const user = await User.findOneAndUpdate(
      { email },
      updateFields,
      { new: true } // Return the updated document
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log(user);
    res.status(200).json({
      message: "User updated successfully!",
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send("Something went wrong");
  }
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1); // Exit the process with failure
  });
