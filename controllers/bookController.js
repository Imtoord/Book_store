const {
  uploadSingleImage,
  resizeImage,
  uploadPDF,
} = require("../middlewares/uploadImageMiddleware");
const { Book } = require("../models/Book");
const {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
  search,
} = require("./factory");


// Image upload
exports.upload = uploadSingleImage("cover");

const arr = ["books", "book", "jpeg", 700, 800, 95];
exports.resizeImage = resizeImage(arr);
// exports.uploadPDF = uploadPDF();

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

