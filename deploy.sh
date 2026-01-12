#!/bin/bash

# Script will fail if it detects an error
set -e

# Prompt the user for a commit message
read -p "Enter commit message: " commit_message

# Check that the commit message is not empty
if [ -z "$commit_message" ]; then
  echo "Commit message cannot be empty. Aborting."
  exit 1
fi

# Add all changes to Git staging
git add .

# Create a commit with the user's message
git commit -m "$commit_message"

# Push changes to GitHub
git push origin main

# Deploy the project to Deno
deployctl deploy --entrypoint server/app.js --project=discussion-forum --prod

echo "Deployment complete! GitHub and Deno project are up to date."

