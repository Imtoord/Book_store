const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  createAuthor,
  getSingleAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

router.use(verifyToken,verifyTokenAndAdmin); //admin

router.route("/").get(getAllAuthors).post(createAuthor);

router
  .route("/:id")
  .get(getSingleAuthor)
  .put(updateAuthor)
  .delete(deleteAuthor);

module.exports = router;
