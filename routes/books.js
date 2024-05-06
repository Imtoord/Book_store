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

const { cloudinary } = require("../middlewares/uploadImageMiddleware");
const multer = require("multer");

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


router.use("/:bookId/reviews", review);

router.route("/").get(getBooks);
router.route("/:id").get(getBook);

router.use(verifyToken, verifyTokenAndAdmin);

router.route("/").post(upload.single("cover"), createBook);
router.route("/:id").put(updateBook).delete(deleteBook);

module.exports = router;
