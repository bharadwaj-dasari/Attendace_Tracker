const { body, validationResult } = require('express-validator');

exports.userValidationRules = () => {
  return [
    body('Email').isEmail().withMessage('Enter a valid email address'),
    body('Password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('Role').isIn(['student', 'admin', 'teacher']).withMessage('Invalid role'),
  ];
};

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};
