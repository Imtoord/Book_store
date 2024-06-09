const { cloudinary } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");

const { User } = require("../models/User");
const { ErrorHandler } = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatuers");
const { Book } = require("../models/Book");
const { Cart } = require("../models/Cart");
const { deleteOne, updateOne, getOne, search } = require("./factory");

exports.getBooks = asyncHandler(async (req, res) => {
  let filterObjx = {};
  if (req.filterobj) {
    filterObjx = req.filterobj;
  }

  const documentCount = await Book.countDocuments(filterObjx);
  const apiFeatures = new ApiFeatures(Book.find(filterObjx), req.query)
    .sort()
    .pagination(documentCount)
    .fields()
    .filter()
    .search();

  const { mongoQuery, pagination } = apiFeatures;
  let results = await mongoQuery;

  if (req.user && req.user._id) {
    const user = await User.findById(req.user._id);
    const wishList = user.wishList || [];
    const cart = await Cart.findOne({ user_id: req.user._id.toString() });
    const books_in_cart = cart.books.map((item) => item.book_id._id.toString());
    results = results.map((book) => {
      return {
        ...book.toObject(),
        in_favorite: wishList.includes(book._id.toString()),
        in_cart: books_in_cart.includes(book._id.toString()),
      };
    });
  } else {
    results = results.map((book) => {
      return {
        ...book.toObject(),
        in_favorite: false,
        in_cart: false,
      };
    });
  }

  return res.status(200).json({
    success: true,
    results: results.length,
    pagination,
    data: results,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const { title, author, description, price, rating, new_price, pdf } =
    req.body;

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Cover file is required",
    });
  }

  cloudinary.uploader.upload(req.file.path, async function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Error uploading cover image",
      });
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      new_price,
      cover: result.url,
      rating,
      pdf,
    });

    res.status(200).json({
      success: true,
      message: "Book uploaded successfully",
      data: book,
    });
  });
});

exports.getBook = getOne(Book, "reviews");

exports.updateBook = updateOne(Book);

exports.deleteBook = deleteOne(Book);

exports.searchBook = search(Book);
