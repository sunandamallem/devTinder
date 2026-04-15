//import mongoose
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sunanda4549_db_user:chfed9Qq7EKb1wec@namastenode.mdj8ldm.mongodb.net/devTinder",
  );
};

module.exports = connectDB;

connectDB()
  .then(() => {
    console.log("databse connection is extablished");
  })
  .catch((err) => {
    console.error("databse cannot be connected");
  });
