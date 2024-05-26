// controllers/userController.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { createUser, findByEmail, findById } from "../model/user.respository.js"

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Controller for user authentication
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await findByEmail(email);

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new AppError("Invalid email or password", 401);
  }
});

// Controller for user registration
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, isAdmin = false } = req.body; // Use default value for isAdmin

  const userExists = await findByEmail(email);

  if (userExists) {
    res.status(400);
    throw new AppError("User already exists", 400);
  }

  const user = await createUser({
    username,
    email,
    password,
    isAdmin,
  });

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// Controller to get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

// Controller to update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await findById(req.user._id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    token: generateToken(updatedUser._id),
  });
});
