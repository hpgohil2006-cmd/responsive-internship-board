
"use strict";

const { body, param, query } = require("express-validator");

const allowedModes = [
  "Remote",
  "Hybrid",
  "On-site"
];

const internshipIdValidation = [
  param("id")
    .trim()
    .matches(/^INT-\d+$/)
    .withMessage("ID must follow the format INT-101.")
];

const createInternshipValidation = [
  body("id")
    .trim()
    .matches(/^INT-\d+$/)
    .withMessage("ID must follow the format INT-101."),

  body("title")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters."),

  body("domain")
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Domain is required and must be valid."),

  body("mode")
    .trim()
    .isIn(allowedModes)
    .withMessage("Mode must be Remote, Hybrid, or On-site."),

  body("location")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location is required."),

  body("skills")
    .isArray({ min: 1 })
    .withMessage("Skills must be a non-empty array."),

  body("skills.*")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each skill must contain 1 to 50 characters."),

  body("openings")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Openings must be a positive integer.")
    .toInt(),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),

  body("application_url")
    .optional({ nullable: true })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage("Application URL must be a valid HTTP or HTTPS URL.")
];

const updateInternshipValidation = [
  ...internshipIdValidation,

  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters."),

  body("domain")
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage("Domain must be valid."),

  body("mode")
    .optional()
    .trim()
    .isIn(allowedModes)
    .withMessage("Mode must be Remote, Hybrid, or On-site."),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location is required."),

  body("skills")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Skills must be a non-empty array."),

  body("skills.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each skill must contain 1 to 50 characters."),

  body("openings")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Openings must be a positive integer.")
    .toInt(),

  body("description")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters."),

  body("application_url")
    .optional({ nullable: true })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true
    })
    .withMessage("Application URL must be a valid HTTP or HTTPS URL.")
];

const listInternshipValidation = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage("Page must be a positive integer.")
    .toInt(),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100.")
    .toInt(),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search cannot exceed 100 characters."),

  query("domain")
    .optional()
    .trim()
    .isLength({ max: 80 })
    .withMessage("Domain filter is too long."),

  query("mode")
    .optional()
    .trim()
    .isIn(allowedModes)
    .withMessage("Mode must be Remote, Hybrid, or On-site.")
];

module.exports = {
  internshipIdValidation,
  createInternshipValidation,
  updateInternshipValidation,
  listInternshipValidation
};
