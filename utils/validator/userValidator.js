const Joi = require("joi");
const { ErrorHandler } = require("../errorHandler");

exports.createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
}).options({ abortEarly: false });

exports.getUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

exports.UpdateUserSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  username: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  firstName: Joi.string(),
  lastName: Joi.string(),
}).options({ abortEarly: false });

exports.chack = (obj, schema, next) => {
  const { error } = schema.validate(obj);
  if (error) {
    return next(new ErrorHandler(error.message, 401));
  }
  next();
};
