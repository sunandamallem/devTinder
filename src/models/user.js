const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data ia not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://tse1.mm.bing.net/th/id/OIP.dQuRML4KFwmvsoVD6ZoD2QAAAA?pid=Api",
    },
    about: {
      type: String,
      default: "This is default about of the user",
    },
    skills: {
      type: [String],
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    {
      _id: user._id,
    },
    "DEV@Tinder$790",
    {
      expiresIn: "7d",
    },
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  console.log("INPUT PASSWORD:", passwordInputByUser);
  console.log("DB PASSWORD:", this.password);
  const passwordHash = this.password;
  isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash); //comapre password from user.password pasowrd- is user entered password this .password is hashpassword

  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
