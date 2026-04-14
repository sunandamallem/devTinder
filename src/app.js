//creation of server

const express = require("express");
const app = express();
app.use("/user", [
  (req, res, next) => {
    next();
  },

  (req, res, next) => {
    //route handler 2
    console.log("Handling the route user2");
    //res.send("2nd response !!");
    next();
  },

  (req, res, next) => {
    //route handler 3
    console.log("Handling the route user3");
    //res.send("3rd response !!");
    next();
  },

  (req, res, next) => {
    //route handler 4
    console.log("Handling the route user4");
    res.send("4th response !!");
  },
]);

app.listen(7777, () => {
  console.log("server is successfuly listening on port 7777");
});
