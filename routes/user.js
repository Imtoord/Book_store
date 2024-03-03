const express = require("express");
const router = express.Router();
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
    getAllUser,
    getSingleUser,
    updateUser,
    deleteUser,
} = require("../controllers/userController");

router.route('/:id')
    .delete(verifyTokenAndAuthorization, deleteUser)
    .get(verifyTokenAndAuthorization, getSingleUser)
    .put(verifyTokenAndAuthorization, updateUser)

router.get("/", verifyTokenAndAdmin, getAllUser);

module.exports = router;