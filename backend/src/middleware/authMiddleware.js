import jwt from "jsonwebtoken";
import User from "../features/users/model/user.schema.js";

export const protect = async (req, res, next) => {
  let token;
  try {
    token = req.header("auth-token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};