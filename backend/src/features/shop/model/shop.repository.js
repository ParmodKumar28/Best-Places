// repositories/shopRepository.js
import Shop from "./shop.schema.js";

// Function to find a shop by ID
export const findShopById = async (id) => {
  return await Shop.findById(id);
};

// Function to find all shops
export const findAllShops = async () => {
  return await Shop.find({});
};

// Function to create a new shop
export const createShop = async (shopData) => {
  const shop = new Shop(shopData);
  return await shop.save();
};

// Function to update a shop
export const updateShop = async (id, shopData) => {
  return await Shop.findByIdAndUpdate(id, shopData, { new: true });
};

// Function to delete a shop
export const deleteShop = async (id) => {
  return await Shop.findByIdAndDelete(id);
};

// Function to find shops by admin ID
export const findShopsByAdminId = async (adminId) => {
  return await Shop.find({ admin: adminId });
};

