// export const adminAuth = (req, res, next) => {
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized request");
//   } else {
//     next();
//   }
// };

// export const userAuth = (req, res, next) => {
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized request");
//   } else {
//     next();
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read token from req cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("please login");
    }
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
    console.log(decodedObj);
    const { _id } = decodedObj;
    const user = await User.findById(_id); // i wil find the user

    // if user is not present
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user; //attaching user to req. so in profile u can get
    next(); // means call the next route handler
  } catch (err) {
    res.status(400).send("ERROR" + err.message);
  }
};

module.exports = {
  userAuth,
};
