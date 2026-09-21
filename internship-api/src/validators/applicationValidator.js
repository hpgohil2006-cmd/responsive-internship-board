"use strict";

const { body } = require("express-validator");

const applicationValidation = [
  body("internshipId").trim().matches(/^INT-\d+$/).withMessage("Internship ID is invalid."),
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Name must be between 2 and 100 characters."),
  body("email").trim().isEmail().isLength({ max: 254 }).withMessage("Email must be valid."),
  body("portfolio").optional({ nullable: true, checkFalsy: true }).trim().isURL({ protocols: ["https"], require_protocol: true }).withMessage("Portfolio must be an HTTPS URL."),
  body("message").trim().isLength({ min: 20, max: 2000 }).withMessage("Message must be between 20 and 2000 characters.")
];

module.exports = { applicationValidation };