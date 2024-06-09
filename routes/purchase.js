const express = require("express");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  createPurchase,
  getPurchases,
  getPurchaseById,
  deletePurchase,
} = require("../controllers/purchaseController");

const router = express.Router();

// 
router.post("/", verifyToken, createPurchase);
router.get("/", verifyTokenAndAdmin, getPurchases);
router.get("/:id", verifyToken, getPurchaseById);
router.delete("/:id", verifyTokenAndAdmin, deletePurchase);

module.exports = router;
