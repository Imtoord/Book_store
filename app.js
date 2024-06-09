const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
var compression = require("compression");
const listEndpoints = require("express-list-endpoints");

const app = express();

const connectToDB = require("./config/db");
const { ErrorHandler } = require("./utils/errorHandler");
const { globalError } = require("./middlewares/errorMiddleware");

// connect with DB // next( new ErrorHandler(mge, statuscoed) )
connectToDB();

// middleware
app.use(express.json()); // json ==> obj
app.use(express.urlencoded({ extended: false })); // form data
app.use("/uploads", express.static("uploads")); // image cove
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Hello world",
  });
});

// root Router
app.use("/api/v1", require("./routes/index"));

app.get("/api/endpoints", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

app.all("*", (req, res, next) => {
  next(
    new ErrorHandler(
      `Can't find ${req.method} ${req.originalUrl} on this server`,
      404
    )
  );
});

// global Error
app.use(globalError); //

// app prot & app listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// next(errr) ==> req, res, next
