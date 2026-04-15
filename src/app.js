//creation of server

const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middleswares/auth");
//handle auth middleware for all requests GET,POST,DELTE,PUT,PATCH

app.use("/admin", adminAuth);
app.use("/user", userAuth);

app.post("/user/login", (req, res) => {
  console.log("login");
  res.send("user loggedin successfully");
});

app.get("/user/data", userAuth, (req, res, next) => {
  console.log("user data is sent");
  res.send("User Data is sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.get("/admin/deleteUser", (req, res) => {
  res.send("Data is deleted");
});

app.listen(7777, () => {
  console.log("server is successfuly listening on port 7777");
});
