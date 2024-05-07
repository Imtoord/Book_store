const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");
const { User } = require("../models/User");
const { Book } = require("../models/Book");

exports.addOrRemoveBookFromWishList = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const book = await Book.findById(id);
  if(!book){
    return next(new ErrorHandler("there are no book with id "+ id))
  }
  const isAlreadyInWishList = user.wishList.includes(id);

  if (isAlreadyInWishList) {
    return removeBookToWishList(req, res, next);
  }

  user.wishList.push(id);

  await user.save();

  return res.status(200).json({
    success: true,
    message: "Book added to wishlist",
  });
});

const removeBookToWishList = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { wishList: req.params.id },
  });

  return res.status(200).json({
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

  return res.status(200).json({
    success: true,
    resulte: user.wishList.length,
    wishList: user.wishList,
  });
});
