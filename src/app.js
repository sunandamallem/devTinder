//creation of server

const express = require("express");
const connectDB = require("./config/databse");
const app = express();
const User = require("./models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  console.log(req.body);

  const user = new User(req.body);
  console.log(user);
  await user.save();
  res.send("User added successfully");
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
