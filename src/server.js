import { createServer } from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import env from "./config/env.js";

const server = createServer(app);

async function bootstrap() {
  await connectDB();
  server.listen(env.PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal error starting app:", err);
  process.exit(1);
});
