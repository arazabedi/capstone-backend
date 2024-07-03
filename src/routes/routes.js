import express from "express";
import { body } from "express-validator";
import middlewareConfig from "../middleware/index.js";
import {
  changePasswordController,
  loginController,
  logoutController,
  registerController,
  validateTokenController,
} from "../controllers/auth.controller.js";
import {
  logWeightController,
  getWeightLogController,
  sendFriendRequestController,
  getAllUsersController,
  searchForFriendsController,
  acceptFriendRequestController,
  removeFriendController,
  getFriendRequestsController,
  getSentFriendRequestsController,
  getAllFriendWeightLogsController,
} from "../controllers/user.controller.js";
import authJwt from "../middleware/authJwt.js";
const { verifyToken } = authJwt;
const router = express.Router();
const { verifyRegistration } = middlewareConfig;

router.use((req, res, next) => {
  res.header(
    `Access-Control-Allow-Headers`,
    `x-access-token, Origin, Content-Type, Accept`
  );
  next();
});

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

router.post(
  "/auth/register",
  [
    body("username").exists().escape(),
    body("full_name")
      .exists()
      .custom((value) => {
        if (
          typeof value === "object" &&
          Object.keys(value).length === 3 &&
          typeof value.first_name === "string" &&
          typeof value.middle_name === "string" &&
          typeof value.last_name === "string" &&
          value.first_name.trim() !== "" &&
          value.last_name.trim() !== ""
        ) {
          return true;
        } else {
          throw new Error("Invalid full_name object");
        }
      }),
    body("email").exists().normalizeEmail().isEmail(),
    body("password").exists().escape(),
    verifyRegistration.checkDuplicateUsernameOrEmail,
  ],
  registerController
);
router.post(
  `/auth/login`,
  [body(`username`).exists().escape(), body(`password`).exists().escape()],
  loginController
);
router.get(`/auth/verify-token`, verifyToken, validateTokenController);
router.post(`/auth/logout`, verifyToken, logoutController);

router.post(`/user/password`, verifyToken, changePasswordController);

router.get("/user/weight-log", verifyToken, getWeightLogController);
router.post("/user/weight-log", verifyToken, logWeightController);

router.get(`/users/`, searchForFriendsController);
router.get(`/users/all`, getAllUsersController);

router.post(
  "/user/friends/requests/send/",
  verifyToken,
  sendFriendRequestController
);
router.post(
  "/user/friends/requests/accept/",
  verifyToken,
  acceptFriendRequestController
);
router.get(
  `/user/friends/weight-logs`,
  verifyToken,
  getAllFriendWeightLogsController
);
router.delete(`/user/friends/remove`, verifyToken, removeFriendController);
router.get(
  `/user/friends/requests/received`,
  verifyToken,
  getFriendRequestsController
);
router.get(
  `/user/friends/requests/sent`,
  verifyToken,
  getSentFriendRequestsController
);

export default router;
