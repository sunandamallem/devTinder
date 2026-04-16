//creation of server

const express = require("express");
const connectDB = require("./config/databse");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
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

//get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId; /*in body am passing userId emailId */
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found");
    }
    res.send(users);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//Feed api -GET/feed -get all the users from the datase
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch {
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId; /* in body am passing userId in postman */
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch {
    res.status(400).send("something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  //findout the id
  // const userId = req.body._id; or
  const userId = req.params?.userId; //if userId is not present then ur code will not break
  const data = req.body; // this is the data commin from API

  try {
    const ALLOWED_UPDATES = ["photourl", "about", "gender", "age", "skills"];
    //    {
    //   "userId":"69e07765ac96491929110ce9",
    //   "firstName":"joshika",
    //   "emailId":"joshika@gmail.com",
    //   "password":"phishikaassword@1223",
    //   "gender":"female"
    // }

    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );
    if (!isUpdateAllowed) {
      res.status(400).send("update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("skills cannot be more than 10s");
    }
    await User.findByIdAndUpdate({ _id: userId }, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("databse connection is extablished");
    app.listen(7777, () => {
      console.log("server is successfuly listening on port 7777");
    });
  })
  .catch((err) => {
    console.error("databse cannot be connected");
  });
