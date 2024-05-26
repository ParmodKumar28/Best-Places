// Configuring env
import "./envConfig.js";

// Imports
import express from "express";
import connectDb from "./db/dbConfig.js";
import { errorHandler, notFound } from "./src/middleware/errorHandler.js";
import userRouter from "./src/features/users/routes/user.routes.js";
import shopRouter from "./src/features/shop/routes/shop.routes.js";
import path from "path";
import cors from "cors";

// Creating server
const app = express();

// Cors
app.use(cors());

// Middleware's
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder for serving images
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.get("/", (req, res, next) => {
  res.send("Welcome to select best places");
});

app.use("/api/users", userRouter);
app.use("/api/shops", shopRouter); // Add shop routes

// Use the notFound middleware for handling 404 errors
app.use(notFound);

// Use the errorHandler middleware for handling errors
app.use(errorHandler);

// Listening to server
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(`Error while listening to server: ${err}`);
  } else {
    connectDb();
    console.log(`Server is listening on PORT: ${process.env.PORT}`);
  }
});
