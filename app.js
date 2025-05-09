const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation'); // Import the validation function
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cookieParser());


// input user data
app.post('/signup', async (req, res) => {
  try {
    // Validate the input data
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname: firstName,   // <-- fixed
      lastname: lastName,     // <-- fixed
      email: email,         // <-- fixed
      password: passwordHash,
    });

    await user.save();
    res.status(201).send('User created successfully!');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// Login user
app.post("/login", async (req, res) => {
  try {
    // Extract emailId and password from the request body
    const { email, password } = req.body;

    // Find the user by emailId
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790");

      // Add the token to cookies and send the response
      res.cookie("token", token, { httpOnly: true });
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Profile endpoint
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    // Verify the token
    const decodedMessage = jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decodedMessage;

    // Find the user by ID
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//get user by email
app.get('/user', async (req, res) => {
  const { email } = req.query; // Extract email from query parameters
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

//update user by email (partial update)
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId; // Extract userId from the request parameters
  const data = req.body; // Extract fields to update from the request body

  try {
    // Define allowed fields for updates
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    // Check if all fields in the request body are allowed
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    // Validate the number of skills
    if (data?.skills && data.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    // Update the user in the database
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after", // Return the updated document
      runValidators: true, // Run schema validators
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log(user); // Log the updated user for debugging
    res.status(200).send("User updated successfully");
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).send("UPDATE FAILED: " + err.message);
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
    console.error("Failed to connect to the database. Ensure the database is running and the connection string is correct.", err);
    process.exit(1); // Exit the process with failure
  });
