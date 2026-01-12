import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";

/**
 * ------------------------------------------------------------------
 * App & database setup
 * ------------------------------------------------------------------
 */
const app = new Hono();

const sql = postgres({
  host: process.env.PGHOST || "wsd_project_database",
  port: process.env.PGPORT || 5432,
  username: process.env.PGUSER || "username",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "database",
});

/**
 * ------------------------------------------------------------------
 * Global middleware
 * ------------------------------------------------------------------
 * These apply to all routes:
 * - CORS: allows browser requests
 * - Logger: logs all requests (useful in Docker / Deploy logs)
 */
app.use("/*", cors());
app.use("/*", logger());

/**
 * ------------------------------------------------------------------
 * Helper functions
 * ------------------------------------------------------------------
 */

/**
 * Validate and parse route parameters that should be integers.
 *
 * Why this exists:
 * - Route params arrive as strings
 * - Number("undefined") => NaN
 * - Sending NaN to Postgres causes a 500 error
 *
 * This helper:
 * - Converts string -> number
 * - Ensures it's a valid integer
 * - Returns a consistent 400 error instead of crashing the DB query
 */
const parseId = (value, name = "id") => {
  const id = Number(value);
  if (!Number.isInteger(id)) {
    return { error: `${name} must be a valid integer` };
  }
  return { id };
};

/**
 * Validate text input fields (e.g. course names, question titles, content).
 *
 * Rules:
 * - Must be a string
 * - Must not be empty
 * - Must have at least 3 characters
 */
const isValidText = (value) =>
  typeof value === "string" && value.trim().length >= 3;

/**
 * ------------------------------------------------------------------
 * Health check (demo / monitoring)
 * ------------------------------------------------------------------
 * Used by the frontend to verify that the API is running.
 * Safe to call, does not touch the database.
 */
app.get("/api/health", (c) =>
  c.json({
    ok: true,
    service: "discussion-forum-api",
    time: new Date().toISOString(),
  })
);

/**
 * ------------------------------------------------------------------
 * Courses
 * ------------------------------------------------------------------
 */

app.get("/api/courses", async (c) => {
  const courses = await sql`SELECT id, name FROM courses`;
  return c.json(courses);
});

app.get("/api/courses/:id", async (c) => {
  const { id, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const [course] = await sql`
    SELECT id, name FROM courses WHERE id = ${id}
  `;
  return c.json(course);
});

app.post("/api/courses", async (c) => {
  const { name } = await c.req.json();
  if (!isValidText(name)) {
    return c.json({ error: "Invalid course name" }, 400);
  }

  const [course] = await sql`
    INSERT INTO courses (name)
    VALUES (${name})
    RETURNING id, name
  `;
  return c.json(course);
});

app.delete("/api/courses/:id", async (c) => {
  const { id, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const [course] = await sql`
    DELETE FROM courses
    WHERE id = ${id}
    RETURNING id, name
  `;
  return c.json(course);
});

/**
 * ------------------------------------------------------------------
 * Questions
 * ------------------------------------------------------------------
 */

app.get("/api/courses/:id/questions", async (c) => {
  const { id: courseId, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const questions = await sql`
    SELECT id, title, text, upvotes, course_id
    FROM questions
    WHERE course_id = ${courseId}
  `;
  return c.json(questions);
});

app.post("/api/courses/:id/questions", async (c) => {
  const { id: courseId, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const { title, text } = await c.req.json();
  if (!isValidText(title) || !isValidText(text)) {
    return c.json({ error: "Invalid question data" }, 400);
  }

  const [question] = await sql`
    INSERT INTO questions (course_id, title, text)
    VALUES (${courseId}, ${title}, ${text})
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

app.post("/api/courses/:id/questions/:qId/upvote", async (c) => {
  const { id: courseId, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const { id: qId, error: qErr } = parseId(c.req.param("qId"), "questionId");
  if (qErr) return c.json({ error: qErr }, 400);

  const [question] = await sql`
    UPDATE questions
    SET upvotes = upvotes + 1
    WHERE id = ${qId} AND course_id = ${courseId}
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

app.delete("/api/courses/:id/questions/:qId", async (c) => {
  const { id: courseId, error } = parseId(c.req.param("id"), "courseId");
  if (error) return c.json({ error }, 400);

  const { id: qId, error: qErr } = parseId(c.req.param("qId"), "questionId");
  if (qErr) return c.json({ error: qErr }, 400);

  const [question] = await sql`
    DELETE FROM questions
    WHERE id = ${qId} AND course_id = ${courseId}
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

/**
 * ------------------------------------------------------------------
 * Export app (used by server entrypoint)
 * ------------------------------------------------------------------
 */
export default app;
