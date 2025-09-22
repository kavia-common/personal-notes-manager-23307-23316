/**
 * This file can be copied to public/env.js and edited during deployment to set runtime env variables.
 * The orchestrator should write NOTES_API_BASE_URL pointing to the notes_database backend.
 *
 * Example:
 * window.__env__ = {
 *   NOTES_API_BASE_URL: "https://your-backend.example.com"
 * };
 */
window.__env__ = window.__env__ || {
  NOTES_API_BASE_URL: "/api"
};
