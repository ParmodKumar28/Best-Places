// Configuring database
import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      family: 4,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.log(
      `Something went wrong while connecting to the database: ${error.message}`
    );
  }
};

export default connectDb;
