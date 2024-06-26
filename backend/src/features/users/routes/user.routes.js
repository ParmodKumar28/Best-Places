// routes/userRoutes.js
import express from "express";
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  updateUserProfilePicture,
} from "../controller/user.controller.js";
import { protect } from "../../../middleware/authMiddleware.js";
import upload from "../../../middleware/uploadMiddleware.js";

const userRouter = express.Router();

// Route for user login
userRouter.post("/login", authUser);

// Route for user registration
userRouter.post("/register", registerUser);

// Routes for getting and updating user profile
userRouter
  .route("/profile")
  .get(protect, getUserProfile) // Protected route to get user profile
  .put(protect, updateUserProfile); // Protected route to update user profile

// Route for updating user profile picture
userRouter.put(
  "/profile/picture",
  protect,
  upload.single("profilePicture"), // Use Multer middleware for single file upload
  updateUserProfilePicture
);

export default userRouter;
