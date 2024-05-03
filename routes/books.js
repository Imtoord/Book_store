const express = require("express");
const router = express.Router();


const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const {
  getBook,
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  uploadBook,
  addPath,
} = require("../controllers/bookController");
const review = require("./review");
router.use("/:bookId/reviews", review);

router.route("/").get(getBooks);
router.route("/:id").get(getBook);

router.use(verifyToken, verifyTokenAndAdmin);

router.route("/").post(
  uploadBook,
  addPath,
  createBook
);
router.route("/:id").put(updateBook).delete(deleteBook);

module.exports = router;
