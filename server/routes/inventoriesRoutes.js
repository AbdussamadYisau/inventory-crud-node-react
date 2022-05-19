const express = require("express");
const router = express.Router();

const {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  addToDeletedInventory,
  getDeletedInventory,
  restoreInventory
} = require("../controllers/inventoriesController");
const {
  validateInventories,
  isRequestValid,
} = require("../validators/inventoriesValidator");

// Get Inventory
router.get("/api/inventory", getInventory);

// Get Inventory by ID
router.get("/api/inventory/:id", getInventoryById);

// Create Inventory
router.post(
  "/api/inventory",
  validateInventories,
  isRequestValid,
  createInventory
);

// Update Inventory
router.put("/api/inventory/:id", updateInventory);


// Add to deleted inventory
router.put("/api/addToDeletedInventory/:id", addToDeletedInventory);

// Get deleted inventory
router.get("/api/deletedInventory", getDeletedInventory);

// Restore inventory
router.put("/api/restore/:id", restoreInventory);

module.exports = router;
