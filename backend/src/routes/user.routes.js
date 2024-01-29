import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../contollers/user.controller.js";
import { verifyJwt } from "../middlewares/verifyJwt.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

// secured Routes
router.route("/refresh-token").post(verifyJwt, refreshAccessToken);

export default router;
