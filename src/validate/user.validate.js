"use strict";
const Joi = require("joi");

class UserValidate {
  static userRegisterSchema = Joi.object({
    username: Joi.string().min(8).max(24).alphanum().required(),
    email: Joi.string().email().required(), // Thêm trường email vào schema
    password: Joi.string()
        .pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .required()
        .messages({
            "string.pattern.base":
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Confirm password must match password",
        }),
});

  static userLoginSchema = Joi.object({
    username: Joi.string().alphanum().required(),
    password: Joi.string().required(),
  });

  static userAuthenticationSchema = Joi.object({
    id: Joi.string().required(),
  });
}

module.exports = UserValidate;
