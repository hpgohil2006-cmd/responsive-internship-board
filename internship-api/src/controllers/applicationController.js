"use strict";

function createApplication(database) {
  return (req, res, next) => {
    try {
      const { internshipId, name, email, portfolio, message } = req.body;
      const internship = database
        .prepare("SELECT id FROM internships WHERE id = ?")
        .get(internshipId);

      if (!internship) {
        return res.status(404).json({
          status: "error",
          data: null,
          error: { code: "INTERNSHIP_NOT_FOUND", message: "Internship not found." }
        });
      }

      try {
        const result = database.prepare(`
          INSERT INTO applications
            (internship_id, applicant_name, applicant_email, portfolio_url, message)
          VALUES (@internshipId, @name, @email, @portfolio, @message)
        `).run({ internshipId, name, email: email.toLowerCase(), portfolio: portfolio || null, message });

        return res.status(201).json({
          status: "success",
          data: { id: Number(result.lastInsertRowid), internshipId },
          meta: {}
        });
      } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
          return res.status(409).json({
            status: "error",
            data: null,
            error: { code: "DUPLICATE_APPLICATION", message: "You have already applied for this internship." }
          });
        }
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
}

module.exports = { createApplication };