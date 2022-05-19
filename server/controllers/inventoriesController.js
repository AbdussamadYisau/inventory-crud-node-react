const inventoryModel = require("../models/inventoriesDB");
require("dotenv/config");

// @route  GET api/inventory
// @desc   Get all inventory
// @access Public
exports.getInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ category: "Available" })
      .select({
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      });
    return res.status(200).json({
      success: true,
      data: inventory,
      message: "Inventory fetched successfully.",
      count: inventory.length,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// @route  GET api/inventory/:id
// @desc   Get inventory by id
// @access Public
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await inventoryModel.findById(req.params.id);
    const {_id, name, description, price, category, quantity, deleteComment } = inventory;
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
        error: "Inventory not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: {_id, name, description, price, category, quantity, deleteComment},
      message: "Inventory fetched successfully.",
      count: 1,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// @route  POST api/inventory
// @desc   Create inventory
// @access Public
exports.createInventory = async (req, res) => {
  try {
    await inventoryModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Inventory created successfully.",
      count: 1,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// @route  PUT api/inventory/:id
// @desc   Update inventory
// @access Public
exports.updateInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    const {_id, name, description, price, category, quantity, deleteComment } = inventory;
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
        error: "Inventory not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: {_id, name, description, price, category, quantity, deleteComment},
      message: "Inventory updated successfully.",
      count: 1,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// Cron Job Function to Delete Inventories that have been tagged deleted for more than or up to 3 days
exports.deleteInventoryForever = async () => {
  let fromDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3);

  await inventoryModel.deleteMany({
    category: "Deleted",
    updatedAt: {
      $lt: fromDate.toISOString(),
    },
  }),
    function (err) {
      if (err) {
        console.error(err.message);
      }
    };
  console.log("Records Deleted Successfully");
};

// @route  PUT api/addToDeletedInventory/:id
// @desc   Add inventory to deleted inventory
// @access Public
exports.addToDeletedInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    const {_id, name, description, price, category, quantity, deleteComment } = inventory;
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
        error: "Inventory not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: {_id, name, description, price, category, quantity, deleteComment},
      message: "Inventory item added to deleted.",
      count: 1,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};


// @route PUT api/restoreInventory/:id
// @desc Restore inventory
// @access Public
exports.restoreInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel.findByIdAndUpdate(
      req.params.id,
      {category: "Available"},
      {
        new: true,
        runValidators: true,
      }
    );
    const {_id, name, description, price, category, quantity, deleteComment } = inventory;
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory not found.",
        error: "Inventory not found.",
      });
    }
    return res.status(200).json({
      success: true,
      data: {_id, name, description, price, category, quantity, deleteComment},
      message: "Inventory item restored successfully.",
      count: 1,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};

// @route  GET api/deletedInventory
// @desc   Get all  deleted inventory
// @access Public
exports.getDeletedInventory = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ category: "Deleted" })
      .select({
        createdAt: 0,
        __v: 0,
      });
    return res.status(200).json({
      success: true,
      data: inventory,
      message: "Deleted inventories fetched successfully.",
      count: inventory.length,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message,
    });
  }
};
