import { User } from "../models/user.models.js";
import { createError } from "../utils/createError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";

const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId).exec();

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    next(
      createError(
        500,
        "Something went wrong while genrating access and refresh token"
      )
    );
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (
      [fullName, email, username, password].some((field) => field.trim() === "")
    ) {
      next(createError(400, "All the fields must be filled"));
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    }).exec();

    if (existingUser) {
      next(
        createError(409, "User with the same username or email already exists")
      );
    }

    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      password,
      email,
    });

    const createdUser = await User.findById(user._id)
      .select("-password  -refreshToken")
      .exec();

    if (!createdUser) {
      next(createError(500, "Something went wrong while creating the user"));
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || username.trim() === "" || !email || email.trim() === "") {
      next(createError(400, "username or email is madatory"));
    }

    const user = await User.findOne({ $or: [{ username }, { email }] }).exec();

    if (!user) {
      next(createError(404, "User not found"));
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      next(createError(401, "Invalid user credentials"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = await User.findById(user._id)
      .select("-password -refreshToken")
      .exec();

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, loggedInUser, "User authenticated successfully")
      );
  } catch (error) {
    next(error);
  }
};
export { registerUser, loginUser };
