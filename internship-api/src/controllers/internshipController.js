
"use strict";

function parseJsonOrText(value) {
    if (!value) return [];

    if (Array.isArray(value)) {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        return value
            .split(",")
            .map(item => item.trim())
            .filter(Boolean);
    }
}

function parseInternship(row) {
    return {
        id: row.id,
        title: row.title,
        company: row.company,
        location: row.location,
        domain: row.domain,
        mode: row.mode,
        openings: row.openings,
        description: row.description,
        skills: parseJsonOrText(row.skills),
        duration: row.duration,
        stipend: row.stipend,
        apply_url: row.apply_url || row.application_url,
        application_url: row.application_url || row.apply_url,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}


function listInternships(database) {
  return (req, res, next) => {
    try {
      const page = Number(req.query.page || 1);
      const limit = Number(req.query.limit || 10);
      const offset = (page - 1) * limit;

      const search = req.query.search
        ? String(req.query.search).trim()
        : "";

      const domain = req.query.domain
        ? String(req.query.domain).trim()
        : "";

      const mode = req.query.mode
        ? String(req.query.mode).trim()
        : "";

      const conditions = [];
      const parameters = {};

      if (search) {
        conditions.push(`
          (
            title LIKE @search
            OR domain LIKE @search
            OR location LIKE @search
            OR skills LIKE @search
          )
        `);

        parameters.search = `%${search}%`;
      }

      if (domain) {
        conditions.push("domain = @domain");
        parameters.domain = domain;
      }

      if (mode) {
        conditions.push("mode = @mode");
        parameters.mode = mode;
      }

      const whereClause =
        conditions.length > 0
          ? `WHERE ${conditions.join(" AND ")}`
          : "";

      const totalRow = database
        .prepare(`
          SELECT COUNT(*) AS total
          FROM internships
          ${whereClause}
        `)
        .get(parameters);

      const rows = database
        .prepare(`
          SELECT *
          FROM internships
          ${whereClause}
          ORDER BY created_at DESC, id ASC
          LIMIT @limit OFFSET @offset
        `)
        .all({
          ...parameters,
          limit,
          offset
        });

      const total = totalRow.total;
      const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

      const pagination = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1 && totalPages > 0
      };

      return res.status(200).json({
        status: "success",
        data: rows.map(parseInternship),
        pagination,
        meta: pagination
      });
    } catch (error) {
      next(error);
    }
  };
}

function getInternship(database) {
  return (req, res, next) => {
    try {
      const row = database
        .prepare(`
          SELECT *
          FROM internships
          WHERE id = ?
        `)
        .get(req.params.id);

      if (!row) {
        return res.status(404).json({
          status: "error",
          data: null,
          error: {
            code: "INTERNSHIP_NOT_FOUND",
            message: `Internship ${req.params.id} was not found.`
          }
        });
      }

      return res.status(200).json({
        status: "success",
        data: parseInternship(row)
      });
    } catch (error) {
      next(error);
    }
  };
}

function createInternship(database) {
  return (req, res, next) => {
    try {
      const {
        id,
        title,
        domain,
        mode,
        location,
        skills,
        openings,
        description = null,
        application_url = null
      } = req.body;

      const existing = database
        .prepare(`
          SELECT id
          FROM internships
          WHERE id = ?
        `)
        .get(id);

      if (existing) {
        return res.status(409).json({
          status: "error",
          data: null,
          error: {
            code: "DUPLICATE_ID",
            message: `Internship ${id} already exists.`
          }
        });
      }

      const statement = database.prepare(`
        INSERT INTO internships
        (
          id,
          title,
          domain,
          mode,
          location,
          skills,
          openings,
          description,
          application_url,
          created_at,
          updated_at
        )
        VALUES
        (
          @id,
          @title,
          @domain,
          @mode,
          @location,
          @skills,
          @openings,
          @description,
          @application_url,
          CURRENT_TIMESTAMP,
          CURRENT_TIMESTAMP
        )
      `);

      statement.run({
        id,
        title,
        domain,
        mode,
        location,
        skills: JSON.stringify(skills),
        openings,
        description,
        application_url
      });

      const created = database
        .prepare(`
          SELECT *
          FROM internships
          WHERE id = ?
        `)
        .get(id);

      return res.status(201).json({
        status: "success",
        data: parseInternship(created)
      });
    } catch (error) {
      next(error);
    }
  };
}

function updateInternship(database) {
  return (req, res, next) => {
    try {
      const existing = database
        .prepare(`
          SELECT *
          FROM internships
          WHERE id = ?
        `)
        .get(req.params.id);

      if (!existing) {
        return res.status(404).json({
          status: "error",
          data: null,
          error: {
            code: "INTERNSHIP_NOT_FOUND",
            message: `Internship ${req.params.id} was not found.`
          }
        });
      }

      const body = req.body;

      if (Object.keys(body).length === 0) {
        return res.status(400).json({
          status: "error",
          data: null,
          error: {
            code: "EMPTY_UPDATE",
            message: "At least one field is required for an update."
          }
        });
      }

      const updated = {
        title: body.title ?? existing.title,
        domain: body.domain ?? existing.domain,
        mode: body.mode ?? existing.mode,
        location: body.location ?? existing.location,
        skills: body.skills ?? JSON.parse(existing.skills),
        openings: body.openings ?? existing.openings,
        description:
          body.description !== undefined
            ? body.description
            : existing.description,
        application_url:
          body.application_url !== undefined
            ? body.application_url
            : existing.application_url
      };

      database
        .prepare(`
          UPDATE internships
          SET
            title = @title,
            domain = @domain,
            mode = @mode,
            location = @location,
            skills = @skills,
            openings = @openings,
            description = @description,
            application_url = @application_url,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = @id
        `)
        .run({
          id: req.params.id,
          title: updated.title,
          domain: updated.domain,
          mode: updated.mode,
          location: updated.location,
          skills: JSON.stringify(updated.skills),
          openings: updated.openings,
          description: updated.description,
          application_url: updated.application_url
        });

      const result = database
        .prepare(`
          SELECT *
          FROM internships
          WHERE id = ?
        `)
        .get(req.params.id);

      return res.status(200).json({
        status: "success",
        data: parseInternship(result)
      });
    } catch (error) {
      next(error);
    }
  };
}

function deleteInternship(database) {
  return (req, res, next) => {
    try {
      const result = database
        .prepare(`
          DELETE FROM internships
          WHERE id = ?
        `)
        .run(req.params.id);

      if (result.changes === 0) {
        return res.status(404).json({
          status: "error",
          data: null,
          error: {
            code: "INTERNSHIP_NOT_FOUND",
            message: `Internship ${req.params.id} was not found.`
          }
        });
      }

      return res.status(200).json({
        status: "success",
        data: {
          id: req.params.id,
          deleted: true,
          message: "Internship deleted successfully."
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  listInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
};
