import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
import postgres from "postgres";

const app = new Hono();
const sql = postgres({
  host: process.env.PGHOST || "wsd_project_database",
  port: process.env.PGPORT || 5432,
  username: process.env.PGUSER || "username",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "database",
});

app.use("/*", cors());
app.use("/*", logger());

const isValidText = (value) =>
  typeof value === "string" && value.trim().length >= 3;

// Courses
app.get("/api/courses", async (c) => {
  const courses = await sql`SELECT id, name FROM courses`;
  return c.json(courses);
});

app.get("/api/courses/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [course] = await sql`SELECT id, name FROM courses WHERE id = ${id}`;
  return c.json(course);
});

app.post("/api/courses", async (c) => {
  const { name } = await c.req.json();
  if (!isValidText(name)) return c.json({ error: "Invalid course name" }, 400);

  const [course] = await sql`
    INSERT INTO courses (name) VALUES (${name})
    RETURNING id, name
  `;
  return c.json(course);
});

app.delete("/api/courses/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const [course] = await sql`
    DELETE FROM courses WHERE id = ${id} RETURNING id, name
  `;
  return c.json(course);
});

// Questions
app.get("/api/courses/:id/questions", async (c) => {
  const courseId = Number(c.req.param("id"));
  const questions = await sql`
    SELECT id, title, text, upvotes, course_id
    FROM questions
    WHERE course_id = ${courseId}
  `;
  return c.json(questions);
});

app.post("/api/courses/:id/questions", async (c) => {
  const courseId = Number(c.req.param("id"));
  const { title, text } = await c.req.json();

  if (!isValidText(title) || !isValidText(text))
    return c.json({ error: "Invalid question data" }, 400);

  const [question] = await sql`
    INSERT INTO questions (course_id, title, text)
    VALUES (${courseId}, ${title}, ${text})
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

app.post("/api/courses/:id/questions/:qId/upvote", async (c) => {
  const courseId = Number(c.req.param("id"));
  const qId = Number(c.req.param("qId"));

  const [question] = await sql`
    UPDATE questions
    SET upvotes = upvotes + 1
    WHERE id = ${qId} AND course_id = ${courseId}
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

app.delete("/api/courses/:id/questions/:qId", async (c) => {
  const courseId = Number(c.req.param("id"));
  const qId = Number(c.req.param("qId"));

  const [question] = await sql`
    DELETE FROM questions
    WHERE id = ${qId} AND course_id = ${courseId}
    RETURNING id, title, text, upvotes, course_id
  `;
  return c.json(question);
});

export default app;
