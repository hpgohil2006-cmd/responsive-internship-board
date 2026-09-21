"use strict";

const express = require("express");
const { createApplication } = require("../controllers/applicationController");
const { validateRequest } = require("../middleware/validate");
const { applicationValidation } = require("../validators/applicationValidator");

function applicationRoutes(database) {
  const router = express.Router();
  router.post("/", applicationValidation, validateRequest, createApplication(database));
  return router;
}

module.exports = applicationRoutes;