# Discussion Forum

A starting point for a discussion forum web application. This project is under development and aims to allow users to view courses, topics, posts, and answers. Some routes and functionality are currently implemented, with further features to be added.

## Features (not implemented)

- GET `/courses` – Returns a list of courses.
- GET `/courses/:id` – Returns a single course by id.
- POST `/courses` – Adds a new course (static id for now).
- GET `/courses/:id/topics` – Returns topics for a course.
- GET `/courses/:cId/topics/:tId/posts` – Returns posts for a topic.
- GET `/courses/:cId/topics/:tId/posts/:pId` – Returns a single post with answers.

## Technologies Used

- Deno – Runtime for the server-side application.
- Hono – Web framework for building the server routes.
- Docker – Containerization for local development and environment isolation.
- PostgreSQL – (future use) database for storing persistent data.
- Flyway – (future use) database migrations management.
- Git & GitHub – Version control and remote repository for code.

## Project Status

- Work in progress. Current server routes return JSON responses with static or hardcoded data.
- Database integration has been removed for now; planned to be added later.
- Frontend and E2E tests are partially scaffolded.

## How to Run Locally

1. Clone the repository:
git clone git@github.com:EemilHytonen/discussion-forum.git

2. Start Docker services:
docker compose up -d

3. Run the server:
deno task start

4. Access API at:
http://localhost:8000

## Notes

- Project is under active development; functionality and routes may change.
- This README will be updated as new features are implemented.
- GitHub repository is connected with local development; commits and updates can be pushed automatically after changes are deployed with Deno.
- To update both GitHub and Deno deployment at the same time, use the deploy.sh script:

1. Open a terminal and navigate to the project folder:
cd /path/to/your/project

2. Make the script executable (only required the first time):
chmod +x deploy.sh

3. Run the script:
./deploy.sh

4. Follow the prompt to enter a commit message. The script will:
- Add all changes to Git
- Commit the changes with your message
- Push the commit to GitHub
- Deploy the updated project to Deno

This ensures that your GitHub repository and the live Deno deployment are always in sync.

Alternatively, you can run the commands manually:
git add .
git commit -m "Your message"
git push origin main
deployctl deploy --entrypoint server/app.js --project=discussion-forum
