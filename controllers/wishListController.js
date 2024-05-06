const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/User");

exports.addBookToWishList = asyncHandler(async (req, res, next) => {
  const { book } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isAlreadyInWishList = user.wishList.includes(book);

  if (isAlreadyInWishList) {
    return next(new ErrorHandler("Book is already in wishlist", 400));
  }

  user.wishList.push(book);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Book added to wishlist",
  });
});

exports.removeBookToWishList = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishList: req.params.book },
  });

  res.status(200).json({
    success: true,
    message: "Book removed from wishlist",
  });
});


exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    wishList: user.wishList,
  });
});

