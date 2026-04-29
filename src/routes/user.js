const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender  about skills";

//Get all the pending connection request for the logged in user.request which are reived and to be reviewd so pending requests
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    //i have to make get call from the databse to get all the data
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
    }).populate("fromUserId", USER_SAFE_DATA); //find return array of object findOne() returns one value in array.

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      //finding connectionreqeuset where my fromuserid and touserid are accepted
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });
    res.json({
      data,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    //user should see all other user cards except
    // 0.he should not see his own card
    // 1.he should not see card of his connection already friend /connected to some one
    // 2. user shouldn not see card poeple already ignored
    // 3.already sent connection request

    //Example: Akshay ,Elon,Mark,Donald, Ms Dhoni,Virat
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //i will find all connection request either i have sent or received(sent + received bocz i should nt see these which are sent and received)
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select("fromUserId toUserId")
      .populate("fromUserId", "firstName")
      .populate("toUserId", "lastName");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(
        request.fromUserId._id?.toString() || request.fromUserId.toString(),
      );
      hideUsersFromFeed.add(
        request.toUserId._id?.toString() || request.toUserId.toString(),
      );
    });

    console.log(hideUsersFromFeed);

    //finding all users whose id is not present in my array && alos dont want own card
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    res.json({
      data: users,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;
