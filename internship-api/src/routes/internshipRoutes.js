
"use strict";

const express = require("express");

const {
  listInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
} = require("../controllers/internshipController");

const { validateRequest } = require("../middleware/validate");

const {
  internshipIdValidation,
  createInternshipValidation,
  updateInternshipValidation,
  listInternshipValidation
} = require("../validators/internshipValidator");

function internshipRoutes(database) {
  const router = express.Router();

  // GET /api/internships
  router.get(
    "/",
    listInternshipValidation,
    validateRequest,
    listInternships(database)
  );

  // GET /api/internships/:id
  router.get(
    "/:id",
    internshipIdValidation,
    validateRequest,
    getInternship(database)
  );

  // POST /api/internships
  router.post(
    "/",
    createInternshipValidation,
    validateRequest,
    createInternship(database)
  );

  // PUT /api/internships/:id
  router.put(
    "/:id",
    updateInternshipValidation,
    validateRequest,
    updateInternship(database)
  );

  // DELETE /api/internships/:id
  router.delete(
    "/:id",
    internshipIdValidation,
    validateRequest,
    deleteInternship(database)
  );

  return router;
}

module.exports = internshipRoutes;

