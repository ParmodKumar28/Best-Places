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

// Controller to get all shops
export const getAllShops = asyncHandler(async (req, res) => {
  const shops = await findAllShops();
  res.json(shops);
});

// Controller to get a shop by ID
export const getShopById = asyncHandler(async (req, res) => {
  const shop = await findShopById(req.params.id);
  if (shop) {
    res.json(shop);
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

// Controller to get shops added by a specific admin
export const getShopsByAdminId = asyncHandler(async (req, res) => {
  const adminId = req.params.adminId;
  const shops = await findShopsByAdminId(adminId);
  res.json(shops);
});

// Controller to create a new shop
export const createNewShop = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const { name, city, mood, description, category, rating, location, items } =
      req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];
    const shop = await createShop({
      ...req.body,
      admin: req.user._id,
    });
    res.status(201).json(shop);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// Controller to update a shop
export const updateShopById = asyncHandler(async (req, res) => {
  const shop = await findShopById(req.params.id);
  if (shop) {
    const { name, city, mood, description, category, rating, location, items } =
      req.body;
    const images =
      req.files.length > 0 ? req.files.map((file) => file.path) : shop.images;

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
    res.json(updatedShop);
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

// Controller to delete a shop
export const deleteShopById = asyncHandler(async (req, res) => {
  const shop = await findShopById(req.params.id);
  if (shop) {
    await deleteShop(req.params.id);
    res.json({ message: "Shop removed" });
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});
