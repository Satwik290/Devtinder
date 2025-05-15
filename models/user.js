const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, minLength: 4, maxLength: 20 },
    lastname: { type: String, required: true },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password: " + value);
        }
      },
    },
    age: { type: Number },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: { type: String, default: "about not provided" },
    skill: { type: [String] },
  },
  {
    timestamps: true,
  }
);

userSchema.methodsgetJWT = async function() {
  const user=this;
  const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
   expiresIn: "7d",
  });
   return token;
  };

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user=this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
  passwordInputByUser,
  passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);