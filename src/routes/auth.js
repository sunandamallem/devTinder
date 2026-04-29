const express = require("express");
const app = express(); // no need this line in auth.js bcoz we no need to create application
const authRouter = express.Router(); //router also can be given same way below export and post name to be changed.
const {
  validateSignUpData,
  validateProfileEditData,
} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  //validation of data
  console.log("BODY:", req.body);
  try {
    //validation of data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating new instance pf the user Model
    // const user = new User(req.body); this is not good way
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send({ message: "Email already exists" });
    }

    res
      .status(500)
      .send({ message: "Something went wrong", error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await user.validatePassword(password); //is using bcrypt to check if the password entered by the user is correct. Check if the entered password matches the password stored in the database. password This is what the user typed in login form. user.password - This is the password stored in DB Usually it is hashed $2b$10$XyZabc123... bcrypt.compare() It compares:plain password (input) hashed password (DB) .await Waits for comparison to finish (it’s asynchronous).isPasswordValid true  → password is correct ,false → password is wrong

    if (isPasswordValid) {
      const token = await user.getJWT();
      //1.create JWT token

      console.log(token);
      //i wil send this token back to the
      //2.Add token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      }); //in prod env always use https
      res.json({
        message: "Login successful",
        user: user,
      });
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out successfully");
});
module.exports = authRouter;
