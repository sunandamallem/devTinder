//creation of server

const express = require("express");
const app = express();

// app.use("/user", (req, res) => {
//   res.send("HAHAHAHA......");
// });

app.get("/user", (req, res) => {
  res.send({
    firstName: "Akshay",
    lastName: "Saini",
  });
});

app.post("/user", (req, res) => {
  console.log("data is saved sucessfully");
  res.send("data is saved sucessfully to the Database");
});

app.delete("/user", (req, res) => {
  res.send("Data is deleted scuccesfuly");
});

app.listen(7777, () => {
  console.log("server is successfuly listening on port 7777");
});
