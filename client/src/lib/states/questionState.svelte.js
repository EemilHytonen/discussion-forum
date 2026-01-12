import { writable } from "svelte/store";

export const questions = writable([]);

/**
 * Fetch all questions for a course
 * @param {number|string} courseId
 */
export async function fetchQuestions(courseId) {
  const response = await fetch(`/api/courses/${courseId}/questions`);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`fetchQuestions failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  questions.set(data);
}

/**
 * Add a question to a course
 * @param {number|string} courseId
 * @param {string} title
 * @param {string} text
 */
export async function addQuestion(courseId, title, text) {
  const response = await fetch(`/api/courses/${courseId}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`addQuestion failed: ${response.status} ${body}`);
  }

  await fetchQuestions(courseId);
}

/**
 * Upvote a question
 * @param {number|string} courseId
 * @param {number|string} id
 */
export async function upvoteQuestion(courseId, id) {
  const response = await fetch(`/api/courses/${courseId}/questions/${id}/upvote`, {
    method: "POST",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`upvoteQuestion failed: ${response.status} ${body}`);
  }

  await fetchQuestions(courseId);
}

/**
 * Delete a question
 * @param {number|string} courseId
 * @param {number|string} id
 */
export async function deleteQuestion(courseId, id) {
  const response = await fetch(`/api/courses/${courseId}/questions/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`deleteQuestion failed: ${response.status} ${body}`);
  }

  await fetchQuestions(courseId);
}
