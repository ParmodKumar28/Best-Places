// controllers/userController.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { createUser, findByEmail, findById } from "../model/user.repository.js";
import { ErrorHandler } from "../../../utils/ErrorHandler.js";

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Controller for user authentication
export const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email is provided
    if (!email) {
      return next(new ErrorHandler(400, "Enter email!"));
    }

    // Check if password is provided
    if (!password) {
      return next(new ErrorHandler(400, "Enter password!"));
    }

    // Find the user by email
    const user = await findByEmail(email);

    // Check if user exists
    if (!user) {
      return next(
        new ErrorHandler(400, "User not registered! Please register")
      );
    }

    // Check if the provided password matches the stored password
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      return next(new ErrorHandler(400, "Password incorrect!"));
    }
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
};

// Controller for user registration
export const registerUser = asyncHandler(async (req, res, next) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password) {
      return next(new ErrorHandler(400, "Please provide all required fields"));
    }

    // Check if a user with the given email already exists
    const userExists = await findByEmail(email);
    if (userExists) {
      return next(new ErrorHandler(400, "User already exists"));
    }

    // Create a new user
    const user = await createUser({
      username,
      email,
      password,
      isAdmin,
    });

    // Return the newly created user with a JWT token
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
});

// Controller to get user profile
export const getUserProfile = asyncHandler(async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await findById(req.user._id);

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    // Return the user profile
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
});

// Controller to update user profile
export const updateUserProfile = asyncHandler(async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await findById(req.user._id);

    // Check if user exists
    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    // Update user details with provided values or keep existing values
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    // If a new password is provided, hash it before saving
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Save the updated user
    const updatedUser = await user.save();

    // Return the updated user profile with a new JWT token
    res.status(201).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    return next(new ErrorHandler(400, error.message));
  }
});
