import jwt from "jsonwebtoken";
import { User } from "../models/user.models";
import { createError } from "../utils/createError";

const verifyJwt = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    const token = req.cookies?.accessToken || authHeader?.split(" ")[1];

    if (!token) {
      createError(401, "Unauthrized request");
    }

    const decodedToken = jwt.decode(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      createError(403, "Inalid access token");
    }

    req.user = user;

    next();
  } catch (error) {
    createError(401, error.message || "Invalid access token");
  }
};

export { verifyJwt };
