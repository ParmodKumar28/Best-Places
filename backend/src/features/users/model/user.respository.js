// repositories/userRepository.js
import User from "./user.schema.js";

// Function to find a user by email
export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

// Function to find a user by ID
export const findById = async (id) => {
  return await User.findById(id);
};

// Function to create a new user
export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
