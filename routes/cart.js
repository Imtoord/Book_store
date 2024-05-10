const router = require("express").Router({ mergeParams: true });
const cartController = require("../controllers/cartController");
const { verifyToken } = require("../middlewares/verifyToken");

router.use(verifyToken);

router.post("/:id", cartController.addOrRemoveBookFromCart);
router.get("/", cartController.getLoggedUserCart);
router.delete("/", cartController.clearCart);

module.exports = router;
