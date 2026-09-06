import app from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.log(`
  ======================================================
  📸 Photography Platform API Server Running
  ======================================================
  Environment : ${env.NODE_ENV}
  Port        : ${env.PORT}
  API Base    : http://localhost:${env.PORT}/api/v1
  Health      : http://localhost:${env.PORT}/api/v1/health
  ======================================================
  `);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server process terminated.");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server process terminated.");
    process.exit(0);
  });
});
