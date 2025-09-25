import express from "express";
import morgan from "morgan";
import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import filesRoutes from "./routes/files.routes.js";
import searchRoutes from "./routes/search.routes.js";
import {  notFound, errorHandler } from "./utils/error.js";
import { swaggerMiddleware } from './config/swagger.js'

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === "test" ? "tiny" : "dev"));

// Docs
app.use('/docs', ...swaggerMiddleware)

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);
app.use("/api/search", searchRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

// Errors
// app.use(notFound);
app.use(errorHandler);

export default app;
