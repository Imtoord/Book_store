const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");

const {
  signup,
  login,
  changePassword,
  getMe,
  logout,
  upload,
  resizeImage,
  ifEmailExist,
} = require("../controllers/authController");
const userController = require("../controllers/userController");

router.post("/register", upload, resizeImage, signup); // 200 250
router.post("/login", login);

router.use(verifyToken);

router.post("/logout", logout);
router.post("/logout", logout);
router.post("/changePassword", getMe, changePassword);
router.put("/updateMy", getMe,ifEmailExist,  userController.updateUser);
router.get("/getmy", getMe, userController.getSingleUser);
module.exports = router;
