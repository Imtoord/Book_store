const express = require("express");
const router = express.Router();
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyToken,
} = require("../middlewares/verifyToken");
const {
    getAllBook,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
} = require("../controllers/bookController");

router.route('/').get(verifyToken,getAllBook).post(createBook);
router.route('/:id').get(verifyToken, getBookById).put(verifyTokenAndAuthorization, updateBook).delete(verifyToken,deleteBook);

module.exports = router;