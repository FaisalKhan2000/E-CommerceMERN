import "express-async-errors";
import express from "express";
import morgan from "morgan";
import { config } from "dotenv";
import mongoose from "mongoose";
import NodeCache from "node-cache";

config({
  path: "./.env",
});

// Importing Routes
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";

// Importing Middlewares
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// initialize node cache
export const myCache = new NodeCache();

// middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req, res) => {
  res.send("API Working with /api/v1");
});

// Using Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// making uploads folder static so that it can be used in used directly
app.use("/uploads", express.static("uploads"));
// error middleware
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

async function startServer() {
  try {
    // Ensure MONGODB_URI is defined
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    // Connect to MongoDB using Mongoose
    const connection = await mongoose.connect(mongoUri, {
      dbName: "Ecommerce_2024",
    });

    console.log(`DB Connected to ${connection.connection.host}`);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    // Handle connection errors
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process with an error code
  }
}

// Call the function to start the server
startServer();
