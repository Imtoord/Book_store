const asyncHandler = require("express-async-handler");
const { ErrorHandler } = require("../utils/errorHandler");
const Purchase = require("../models/Purchases");
const Cart = require("../models/Cart");

exports.createPurchase = asyncHandler(async (req, res, next) => {
  const userId = req.user._id.toString();

  // Find the user's cart
  const cart = await Cart.findOne({ user_id: userId }).populate(
    "books.book_id"
  );
  if (!cart || cart.books.length === 0) {
    return next(new ErrorHandler("Your cart is empty", 400));
  }

  // Calculate total amount from cart
  let totalAmount = 0;
  cart.books.forEach((book) => {
    totalAmount += book.price;
  });

  // Create a new purchase record
  const purchase = new Purchase({
    user: userId,
    books: cart.books.map((book) => ({
      book_id: book.book_id._id,
      price: book.price,
    })),
    totalAmount,
  });

  // Save the purchase record
  await purchase.save();

  // Clear the user's cart after successful purchase
  await Cart.findOneAndDelete({ user_id: userId });

  res.status(201).json({
    success: true,
    data: purchase,
  });
});

exports.getPurchases = asyncHandler(async (req, res, next) => {
  const purchases = await Purchase.find({ user: req.user._id }).populate(
    "books.book_id"
  );
  res.status(200).json({
    success: true,
    data: purchases,
  });
});

exports.getPurchaseById = asyncHandler(async (req, res, next) => {
  const purchase = await Purchase.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate("books.book_id");
  if (!purchase) {
    return next(new ErrorHandler("Purchase not found", 404));
  }
  res.status(200).json({
    success: true,
    data: purchase,
  });
});

exports.deletePurchase = asyncHandler(async (req, res, next) => {
  const purchase = await Purchase.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!purchase) {
    return next(new ErrorHandler("Purchase not found", 404));
  }
  res.status(204).json({
    success: true,
  });
});
