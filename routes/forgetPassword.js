const { Router } = require("express");

const router = Router();
const {
  checkUser,
  updateresetpasswordForm,
  updateresetpassword,
} = require("../controllers/passwordController");

router.route("/").post(checkUser);

router
  .route("/:email/:token")
  .get(updateresetpasswordForm)
  .post(updateresetpassword);

module.exports = router;
