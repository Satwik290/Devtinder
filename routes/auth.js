const express =require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User =  require("../models/user");
const bcrypt = require("bcrypt");

// Signup endpoint
authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstname: firstName,
      lastname: lastName,
      email: email,
      password: passwordHash,
    });

    await user.save();
    res.status(201).send('User created successfully!');
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login endpoint
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Use the model's validatePassword method
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Create a JWT token
    const token = await user.getJWT();

    // Add the token to cookies and send the response
    res.cookie("token", token, { 
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true 
    });
    res.send("Login Successful!!!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//logout
authRouter.post("/logout", async (req,res)=>{
    res.cookie("token", null,{
        expires: new Date(Date.now())
    });

    res.send("logout successful!!");
});

module.exports = authRouter;