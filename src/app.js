//creation of server

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Namste from dashboardddddddd");
});

app.use("/test", (req, res) => {
  res.send("Hello from the server111111222222");
});

app.use("/hello", (req, res) => {
  res.send("Hello hellooo");
});

app.listen(7777, () => {
  console.log("server is successfuly listening on port 7777");
});
