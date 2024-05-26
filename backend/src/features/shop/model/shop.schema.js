import mongoose from "mongoose";

// Schema
const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Assuming there's a User model
});

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
