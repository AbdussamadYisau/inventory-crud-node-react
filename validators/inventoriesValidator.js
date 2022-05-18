const { check, validationResult, body } = require("express-validator");

exports.validateInventories = [
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price").notEmpty().withMessage("Price is required"),
  check("quantity").notEmpty().withMessage("Quantity is required"),
];

exports.isRequestValid = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  return res.status(422).json({
    success: false,
    message: "Invalid request",
    errors: extractedErrors,
  });
};
