// controllers/shopController.js
import asyncHandler from "express-async-handler";
import {
  findShopById,
  findAllShops,
  createShop,
  updateShop,
  deleteShop,
  findShopsByAdminId,
} from "../model/shop.repository.js";
import { ErrorHandler } from "../../../utils/ErrorHandler.js";

// Controller to get all shops
export const getAllShops = asyncHandler(async (req, res, next) => {
  try {
    const shops = await findAllShops();
    res.status(200).json(shops);
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});

// Controller to get a shop by ID
export const getShopById = asyncHandler(async (req, res, next) => {
  try {
    const shop = await findShopById(req.params.id);
    if (shop) {
      res.status(200).json(shop);
    } else {
      return next(new ErrorHandler(404, "Shop not found"));
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});

// Controller to get shops added by a specific admin
export const getShopsByAdminId = asyncHandler(async (req, res, next) => {
  try {
    const adminId = req.params.adminId;
    if (!adminId) {
      return next(new ErrorHandler(400, "Please pass admin id in params!"));
    }
    const shops = await findShopsByAdminId(adminId);
    if (!shops) {
      return next(new ErrorHandler(404, "No shops added by you!"));
    }
    res.status(201).json({
      shops,
      msg: "Shops fetched!",
    });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});

// Controller to create a new shop
export const createNewShop = asyncHandler(async (req, res, next) => {
  try {
    // const { name, city, mood, description, category, rating, location, items } =
    //   req.body;

    // Handle uploaded images
    const images = req.files
      ? req.files.map((file) => `http://localhost:8000/${file.path}`)
      : [];

    const location = req.body.location ? JSON.parse(req.body.location) : {};

    // Create a new shop
    const shop = await createShop({
      ...req.body,
      location,
      admin: req.user._id,
      images,
    });

    res.status(201).json({
      shop,
      msg: "Shop Added successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});

// Controller to update a shop
export const updateShopById = asyncHandler(async (req, res, next) => {
  try {
    const shop = await findShopById(req.params.id);
    if (shop) {
      const {
        name,
        city,
        mood,
        description,
        category,
        rating,
        location,
        items,
      } = req.body;

      // Handle uploaded images, or keep existing images if none are provided
      const images =
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : shop.images;

      // Update shop details
      const updatedShop = await updateShop(req.params.id, {
        name,
        city,
        mood,
        description,
        category,
        rating,
        images,
        location,
        items,
      });

      res.status(201).json(updatedShop);
    } else {
      return next(new ErrorHandler(404, "Shop not found"));
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});

// Controller to delete a shop
export const deleteShopById = asyncHandler(async (req, res, next) => {
  try {
    const shop = await findShopById(req.params.id);
    if (shop) {
      await deleteShop(req.params.id, req.user._id);
      return res.status(200).json({ msg: "Shop removed" });
    } else {
      return next(new ErrorHandler(404, "Shop not found"));
    }
  } catch (error) {
    return next(new ErrorHandler(500, error.message));
  }
});
