const express = require('express');
require('dotenv').config();
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authRouter= require("./routes/auth");
const profileRouter= require("./routes/profile");
const requestRouter= require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//get user by email
// app.get('/user', async (req, res) => {
//   const { email } = req.query; // Extract email from query parameters
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).json({
//       firstname: user.firstname,
//       lastname: user.lastname,
//       email: user.email
//     });
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).send("Something went wrong");
//   }
// });

// //feed api
// app.get('/feed', async (req, res) => {
//   try {
//     const users = await User.find({}, { firstname: 1, lastname: 1, email: 1 });
//     res.status(200).json(users);
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).send("Something went wrong");
//   }
// });
// //delete user by email
// app.delete('/user', async (req, res) => {
//   const { email } = req.body; // Extract email from the request body
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }
//   try {
//     const user = await User.findOneAndDelete({ email });
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).send("User deleted successfully!");
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).send("Something went wrong");
//   }
// });

// //update user by email
// app.put('/user', async (req, res) => {
//   const { email, firstname, lastname } = req.body; // Extract email from the request body
//   if (!email) {
//     return res.status(400).send("Email is required");
//   }
//   try {
//     const user = await User.findOneAndUpdate(
//       { email },
//       { firstname, lastname },
//       { new: true } // Return the updated document
//     );
//     if (!user) {
//       return res.status(404).send("User not found");
//     }
//     res.status(200).json({
//       message: "User updated successfully!",
//       firstname: user.firstname,
//       lastname: user.lastname,
//       email: user.email
//     });
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(500).send("Something went wrong");
//   }
// });

// //update user by email (partial update)
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId; // Extract userId from the request parameters
//   const data = req.body; // Extract fields to update from the request body

//   try {
//     // Define allowed fields for updates
//     const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       ALLOWED_UPDATES.includes(key)
//     );

//     // Check if all fields in the request body are allowed
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed");
//     }

//     // Validate the number of skills
//     if (data?.skills && data.skills.length > 10) {
//       throw new Error("Skills cannot be more than 10");
//     }

//     // Update the user in the database
//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after", // Return the updated document
//       runValidators: true, // Run schema validators
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     console.log(user); // Log the updated user for debugging
//     res.status(200).send("User updated successfully");
//   } catch (err) {
//     console.error(err); // Log the error for debugging
//     res.status(400).send("UPDATE FAILED: " + err.message);
//   }
// });

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