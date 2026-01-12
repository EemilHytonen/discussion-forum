import { writable } from "svelte/store";

//const API_URL = "http://localhost:8000";
const API_URL = "http://server:8000"; // server = backend service name Docker Compose
const COURSE_ID = 1;

export const questions = writable([]);

/* Fetch all questions */
export async function fetchQuestions() {
  const response = await fetch(
    `${API_URL}/courses/${COURSE_ID}/questions`
  );
  const data = await response.json();
  questions.set(data);
}

/* Add question */
export async function addQuestion(title, text) {
  await fetch(`${API_URL}/courses/${COURSE_ID}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title, text })
  });

  await fetchQuestions();
}

/* Upvote question */
export async function upvoteQuestion(id) {
  await fetch(
    `${API_URL}/courses/${COURSE_ID}/questions/${id}/upvote`,
    { method: "POST" }
  );

  await fetchQuestions();
}

/* Delete question */
export async function deleteQuestion(id) {
  await fetch(
    `${API_URL}/courses/${COURSE_ID}/questions/${id}`,
    { method: "DELETE" }
  );

  await fetchQuestions();
}
