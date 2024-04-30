const { Author } = require("../models/Author");

const {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
} = require("./factory");

/**
 * @description Get all Authors
 * @method GET
 * @route /Authors
 * @access Private
 */
exports.getAllAuthors = getAll(Author);

/**
 * @description Get a single Author by ID
 * @method GET
 * @route /Authors/:id
 * @access Private only admin 
 */
exports.getSingleAuthor = getOne(Author);

/**
 * @description Update Author
 * @method PUT
 * @route /Authors/:id
 * @access Private
 */
exports.updateAuthor = updateOne(Author);

/**
 * @description Delete Author
 * @method DELETE
 * @route /Authors/:id
 * @access Private only admin 
 */
exports.deleteAuthor = deleteOne(Author);

/**
 * @description Delete Author
 * @method DELETE
 * @route /Authors/:id
 * @access Private only admin 
 */
exports.createAuthor = createOne(Author);
