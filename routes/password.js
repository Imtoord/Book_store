const router = require('express').Router()
const {
  checkUser,
  getForm,
  updatePasswordAndSave,
} = require("../controllers/passwordController");

router.route("/").post(checkUser);

router
  .route("/:id/:token")
  .get(getForm)
  .post(updatePasswordAndSave);

module.exports = router