import Joi from "joi";

export const userSignUpSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  image: Joi.string().uri().allow(null),
  dateOfBirth: Joi.date().less("now").allow(null),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(3).required(),
});
