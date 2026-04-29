// const express = require("express");
// const requestRouter = express.Router();
// const { userAuth } = require("../middlewares/auth");
// const ConnectionRequest = require("../models/connectionRequest");

// requestRouter.post(
//   "/request/send/:status/:toUserId",
//   userAuth,
//   async (req, res) => {
//     try {
//       const fromUserId = req.user._id; // this is loggedin user details
//       const toUserId = req.params.toUserId;
//       const status = req.params.status;

//       const allowedStatus = ["ignored", "interested"];
//       if (!allowedStatus.includes(status)) {
//         return res.status(400).json({
//           message: "Invalid Status Tpye :" + status,
//         });
//       }

//       // if there is existing connection request i wil not be able to send again same request
//       const existingCOnnectionrequest = await ConnectionRequest.findOne({
//         $or: [
//           { fromUserId, toUserId },
//           {
//             fromUserId: toUserId,
//             toUserId: fromUserId,
//           },
//         ],
//       });

//       const connectionRequest = new ConnectionRequest({
//         fromUserId,
//         toUserId,
//         status,
//       });
//       console.log(req.user.firstName, "is sending connection request");
//       const data = await connectionRequest.save(); // this wil save into DB
//       res.json({
//         message: "connection request sent successfully",
//         data: data,
//         //i can also send data of the connection
//       });
//     } catch (err) {
//       res.status(400).send("ERROR: " + err.message);
//     }
//     //sending connectionRequest
//     console.log(req.user.firstName, "is sending connection request");
//     //res.send(req.user.firstName + " " + "sent connection request sent");
//   },
// );

// module.exports = requestRouter;
const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id.toString();
      const { toUserId, status } = req.params;

      // ✅ 1. Allowed status check
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status: " + status,
        });
      }

      // ❌ 2. Prevent sending request to self
      if (fromUserId === toUserId) {
        return res.status(400).json({
          message: "You cannot send connection request to yourself",
        });
      }

      // ❌ 3. Prevent duplicate requests (both directions)
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingRequest) {
        return res.status(400).json({
          message: "Connection request already exists",
        });
      }

      // ✅ 4. Create request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      console.log(`${req.user.firstName} sent request to ${toUserId}`);
      const toUser = await user.findById(toUserId).select("firstName");

      return res.json({
        message: `${req.user.firstName} is interested in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      return res.status(400).send("ERROR: " + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    //now  i will write logic for review API. akshay seding request to Elon
    try {
      const loggedInUser = req.user;
      const status = req.params.status.toLowerCase();
      const { requestId } = req.params;
      // status and reqId comes from request paramater from URLs
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status is not allowed" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      console.log("STATUS:", status);
      console.log("REQUEST ID:", requestId);
      console.log("LOGGED IN USER:", loggedInUser._id);
      console.log("FOUND REQUEST:", connectionRequest);

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found" });
      }

      connectionRequest.status = status;
      await connectionRequest.save();
      res.json({ message: "connection request" });
    } catch (err) {}
  },
);

module.exports = requestRouter;
