import jwt from "jsonwebtoken";
import User from "../features/users/model/user.schema.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

export const protect = async (req, res, next) => {
  let token;
  try {
    token = req.header("auth-token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      throw new ErrorHandler(401, "Not authorized, token failed");
    }
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }

  if (!token) {
    next(new ErrorHandler(401, "Not authorized, no token")); // Pass error to the next middleware
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    next(new ErrorHandler(401, "Not authorized as an admin")); // Pass error to the next middleware
  }
};
