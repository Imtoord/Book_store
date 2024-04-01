const { tr } = require("faker/lib/locales");
const { Book, validateinsert, validateUpdate } = require("../models/Book");
const asyncHandler = require("express-async-handler");

/**
 * @description Get all books
 * @route  /books
 * @method GET
 * @access public
 */
const getAllBook = asyncHandler(async (req, res) => {
  try {
    const pageNumber = req.query.pageNumber || 1;
    const number = 5;
    const min = req.query.min || 0;
    const max = req.query.max || Number.MAX_VALUE;
    const books = await Book.find({ price: { $lte: max, $gte: min } })
      .skip((pageNumber - 1) * number)
      .limit(number);
    res.json({ data: { books } });
  } catch (err) {
    console.log("err", err);
  }
});

/**
 * @description Get single book
 * @route  /books/:id
 * @method GET/post
 * @access public
 */
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json({ data: book });
});

/**
 * @description Add new book
 * @route books/
 * @method post
 * @access public
 */
const createBook = asyncHandler(async (req, res) => {
  const { error } = validateinsert(req.body);
  if (error) return res.status(400).json(error.message);
  const book = new Book(req.body);
  const result = await book.save();
  res.status(200).json({ data: { result } });
});

/**
 * @decsription update
 *  @route /books/:id
 * @method PUT
 * @access public
 */
const updateBook = asyncHandler(async (req, res) => {
  const { error } = validateUpdate(req.body);
  if (error) return res.status(400).json(error.message);
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!book) return res.status(404).send("book not found");
  res.json({ message: " book has been update " });
});

/**
 * @description delete
 * @method delete
 * @access public
 * @route /book/:id
 */
const deleteBook = asyncHandler(async (req, res) => {
  let book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "book not found" });
  if (book.author.toString() != req.user._id)
    return res.status(401).json({ message: "you are not authorized" });
  book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: "book not found" });
  res.json({ message: "book has been deleted" });
});
module.exports = {
  getAllBook,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
