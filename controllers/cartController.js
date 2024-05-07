const asyncHandler = require("express-async-handler");

const { ErrorHandler } = require("../utils/errorHandler");
const { Cart } = require("../models/Cart");
const { Book } = require("../models/Book");
const { User } = require("../models/User");

const calc = (cart) => {
  let total = 0;
  cart.books.forEach((element) => {
    total += element.price;
  });
  cart.total_price = total;
};

exports.addOrRemoveBookFromCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("there are no book with id " + id));
  }

  const testBook = {
    book_id: id,
    price: book.new_price || book.price,
  };

  let cart = await Cart.findOne({ user_id: userId });
  if (!cart) {
    cart = new Cart({
      user_id: userId,
      books: [testBook],
    });
  } else {
    const isAlreadyInCart = cart.books.findIndex(
      (item) => item.book_id._id.toString() === id.toString()
    );

    if (isAlreadyInCart > -1) {
      return removeBookToCart(req, res, next);
    } else {
      cart.books.push(testBook);
    }
  }
  calc(cart);
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Book added to Cart",
  });
});

const removeBookToCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user_id: req.user._id.toString() },
    {
      $pull: { books: { book_id: req.params.id } },
    }
  );
  calc(cart);
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Book removed from Cart",
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user_id: req.user._id.toString() });

  if (!cart) {
    return next(new ErrorHandler("cart not found", 404));
  }

  return res.status(200).json({
    success: true,
    in_cart: cart.books.length,
    data: cart,
  });
});
