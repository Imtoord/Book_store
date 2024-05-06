const { cloudinary } = require("../middlewares/uploadImageMiddleware");
const asyncHandler = require("express-async-handler");

const { User } = require("../models/User");
const { ErrorHandler } = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatuers");
const { Book } = require("../models/Book");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
  search,
} = require("./factory");

/**
 * @description get all Books
 * @route api/Books || api/:categoryId/Books
 * @method get
 * @access public
 */
exports.getBooks = asyncHandler(async (req, res) => {
  let filterObjx = {};
  if (req.filterobj) {
    filterObjx = req.filterobj;
  }

  // Replace 'Model' with your actual model name
  const documentCount = await Book.countDocuments(filterObjx); // Get count based on filters
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
    const wishList = user.wishList || []; // Ensure wishlist is an array
    console.log(wishList);
    // Add favorite status to each book
    results = results.map((book) => {
      return {
        ...book.toObject(),
        favorite: wishList.includes(book._id.toString()),
      };
    });
  } else {
    // If user is not logged in, set favorite status to false for all books
    console.log("user is not logged");
    results = results.map((book) => {
      return {
        ...book.toObject(),
        favorite: false,
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

/**
 * @description create new Books
 * @param {name} req
 * @method post
 * @route api/Books
 * @access private
 */

exports.createBook = async (req, res, next) => {
  const { title, author, description, price, rating, new_price } = req.body;
  // console.log(req.file);
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "cover file is required",
    });
  }

  // Upload image file to Cloudinary
  cloudinary.uploader.upload(req.file.path, async function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "cover uploading image file",
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
    });

    await book.save();
    res.status(200).json({
      success: true,
      message: "book uploaded successfully",
      data: book,
    });
  });
};

/**
 * @description get Book
 * @param {id} req
 * @method get
 * @route api/Books/:id
 * @access public
 */
exports.getBook = getOne(Book, "reviews");

/**
 * @description update Book
 * @param {id} req
 * @method put
 * @route api/Books/:id
 * @access public
 */
exports.updateBook = updateOne(Book);

/**
 * @description delete Book
 * @param {id} req
 * @method delete
 * @route api/Books/:id
 * @access public
 */
exports.deleteBook = deleteOne(Book);

/**
 * @description search Book
 * @param {keyword} req
 * @method get
 *@route api/Books/search
 * @access public
 */

exports.searchBook = search(Book);
