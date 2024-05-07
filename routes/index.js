const Router = require("express").Router();

const userRouter = require("./user");
const authRouter = require("./auth");
const books = require("./books");
const password = require("./password");
const review = require("./review");
const author = require("./author");
const wishList = require("./wishList");
const cart = require("./cart");

Router.use("/users", userRouter); // Admin
Router.use("/auth", authRouter); // to user signup, login, changePassword, getMe, updateMy, logout
Router.use("/books", books);
Router.use("/reviews", review);
Router.use("/forgotPassword", password);
Router.use("/authors", author); // admin he can add, update, delete author
Router.use("/wishlist", wishList); 
Router.use("/carts", cart); 

module.exports = Router;
