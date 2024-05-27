import Joi from "joi";

export const userSignUpSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  username: Joi.string().alphanum().min(3).max(30).required(),
  image: Joi.string().uri().allow(null),
  dateOfBirth: Joi.date().less("now").allow(null),
});

export const userSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
