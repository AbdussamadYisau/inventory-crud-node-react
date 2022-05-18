const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const inventoryRoutes = require("./routes/inventoriesRoutes");
const schedule = require("node-schedule");
const {
  deleteInventoryForever,
} = require("./controllers/inventoriesController");
require("dotenv/config");

const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Cron job to delete inventoryies that have been 'deleted' for more than or up to 30 days
const job = schedule.scheduleJob("0 0 * * *", async () => {
  return deleteInventoryForever();
});

// Routes
app.use("/v1", inventoryRoutes);
app.get("/", (req, res) => {
  // Health Check
  res.send("Hello World, the endpoint is up and healthy.");
});

// Unspecified Endpoints
app.get("*", (req, res) => {
  res.status(404).json({
    message: "Endpoint not found.",
  });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
    // Start the server
    app.listen(process.env.PORT || port, () => {
      console.log(`Server started on port ${process.env.PORT || port}`);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();
