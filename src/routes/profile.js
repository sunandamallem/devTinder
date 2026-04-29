const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.patch("/profile/edit/", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      // if validation is not passed
      throw new Error("Invalid Edit request");
    }
    //return res.status(400).send("Invalid Edit request");
    const loggedInUser = req.user; // this is attached by userAuth middleware
    console.log(loggedInUser); // this user will get loogedin user details

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    //res.send(`${loggedInUser.firstName} Profile updated  successfully`);
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName},your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error :" + err.message);
  }
});

module.exports = profileRouter;
