// repositories/shopRepository.js
import User from "../../users/model/user.schema.js";
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

  // Save the shop
  const savedShop = await shop.save();

  // Find the user by userId and update the shops array
  await User.findByIdAndUpdate(
    shopData.admin,
    { $push: { shops: savedShop._id } }, // Push the newly created shop's ID to the user's shops array
    { new: true } // Return the updated user document
  );

  return savedShop;
};

// Function to update a shop
export const updateShop = async (id, shopData) => {
  return await Shop.findByIdAndUpdate(id, shopData, { new: true });
};

// Function to delete a shop
export const deleteShop = async (id, userId) => {
  // Find and delete the shop
  const deletedShop = await Shop.findByIdAndDelete(id);

  if (!deletedShop) {
    throw new Error("Shop not found");
  }

  // Remove the deleted shop's ID from the user's shops array
  await User.findByIdAndUpdate(
    userId,
    { $pull: { shops: id } }, // Pull the ID of the deleted shop from the user's shops array
    { new: true } // Return the updated user document
  );

  return deletedShop;
};

// Function to find shops by admin ID
export const findShopsByAdminId = async (adminId) => {
  return await Shop.find({ admin: adminId });
};
