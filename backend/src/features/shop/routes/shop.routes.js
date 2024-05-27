// routes/shopRoutes.js
import express from "express";
import {
  getAllShops,
  getShopById,
  createNewShop,
  updateShopById,
  deleteShopById,
  getShopsByAdminId,
} from "../controller/shop.controller.js";
import { protect, admin } from "../../../middleware/authMiddleware.js";
import upload from "../../../middleware/uploadMiddleware.js";

const shopRouter = express.Router();

// Public routes
shopRouter.get("/", protect, getAllShops); // Get all shops
shopRouter.get("/:id", protect, getShopById); // Get a shop by ID

// Protected routes
shopRouter.use(protect); // Protect all routes below this middleware
shopRouter.post("/", admin, upload.array("images", 5), createNewShop); // Create a new shop with image upload
shopRouter.put("/:id", admin, upload.array("images", 5), updateShopById); // Update a shop with image upload
shopRouter.delete("/:id", admin, deleteShopById); // Delete a shop

// Route to get shops added by admin only
shopRouter.get("/admin/:adminId", protect, admin, getShopsByAdminId);

export default shopRouter;
