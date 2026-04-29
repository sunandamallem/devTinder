//creation of server

const express = require("express");
const connectDB = require("./config/databse");
const app = express();
app.use(express.json());

const cors = require("cors"); //stops cord error by adding this
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(cookieParser()); // this is middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }), //whitelisting it meaning provding permision to the 5173 and then cookies wil give to client in aplication tab in n/w tab.vredentials true mean even if am in http not https i can stil send cookies to client
); //stops cord error by adding this
//import routerts
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const passwordRouter = require("./routes/password");
const userRouter = require("./routes/user");

app.use("/", authRouter); // this is middleware
app.use("/", profileRouter); // this is middleware
app.use("/", requestRouter); // this is middleware
app.use("/", passwordRouter); // this is middleware
app.use("/", userRouter); // this is middleware
// app.post("/login", async (req, r es) => {
//   try {
//     //1.validate email and password
//     const { emailId, password } = req.body;
//     const user = await User.findOne({ emailId: emailId }); //finOne wil return u just one entry
//     console.log(user);

//     //now we need to check  whether emailid and password is correct or not.this is return u true or false
//     // const isPasswordValid = await bcrypt.compare(
//     //   "Elon@123",
//     //   "$2b$10$zgT9VZt7N405XkziL4tANO1J7D.5irZqYAwZIjxaxjWcrRDi.Ca0a",
//     // );

//     if (!user) {
//       throw new Error("Email Id isnot prsent in DB");
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (isPasswordValid) {
//       res.cookie("token", "qasqwqwqwqw211asdasasasas");
//       res.send("Login successfull");
//     } else {
//       throw new Error("password is not correct");
//     }
//   } catch (err) {
//     res.status(400).send("ERROR:" + err.message); //when we do ("Error", +err.message)
//   }
// });

//get user by email

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
