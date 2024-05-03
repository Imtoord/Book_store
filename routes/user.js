const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  createUser,
  isExist,
} = require("../controllers/userController");



// router.use(verifyToken, verifyTokenAndAdmin);// admin

router.route("/").get(getAllUsers).post(isExist, createUser);
router.route("/:id").get(getSingleUser).delete(deleteUser).put(updateUser);

module.exports = router;
