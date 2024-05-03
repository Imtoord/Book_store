const { uploadBook } = require("../middlewares/uploadImageMiddleware");
const { Book } = require("../models/Book");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
  search,
} = require("./factory");

// upload book
exports.uploadBook = uploadBook;

exports.addPath = (req, res, next) => {
  req.body.cover =
    process.env.HOST + "/" + req.files["cover"][0].path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
  req.body.pdf =
    process.env.HOST + "/" + req.files["pdf"][0].path.replace(/\\/g, "/"); // Replace backslashes with forward slashes
  next();
};

/**
 * @description get all Books
 * @route api/Books || api/:categoryId/Books
 * @method get
 * @access public
 */
exports.getBooks = getAll(Book);

/**
 * @description create new Books
 * @param {name} req
 * @method post
 * @route api/Books
 * @access private
 */
exports.createBook = createOne(Book);

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
