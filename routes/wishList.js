const router = require("express").Router({ mergeParams: true });
const wishListController = require("../controllers/wishListController");
const { verifyToken } = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("/:id", wishListController.addOrRemoveBookFromWishList);
router.get("/", wishListController.getLoggedUserWishList);

module.exports = router;
