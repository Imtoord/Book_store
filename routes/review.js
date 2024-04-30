const router = require("express").Router({ mergeParams: true });
const { verifyToken } = require("../middlewares/verifyToken");
const {
  exist,
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  isReviewer,
  filter,
} = require("../controllers/reviewController");


router.route("/").get(filter, getReviews);
router.route("/:id").get(getReview);


router.use(verifyToken); //token

router.route("/").post(exist, createReview);

router
  .route("/:id")
  .put(isReviewer, updateReview)
  .delete(isReviewer,deleteReview);

module.exports = router;
