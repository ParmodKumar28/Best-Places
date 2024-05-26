import mongoose from "mongoose";

// Schema
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String },
  images: [{ type: String }], // Array of image paths
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Assuming there's a User model
});

// Middleware to parse the location string back to an object before saving
shopSchema.pre('save', function(next) {
  if (this.isModified('location') && typeof this.location === 'string') {
    try {
      this.location = JSON.parse(this.location);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
