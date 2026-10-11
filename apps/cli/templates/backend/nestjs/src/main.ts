import { NestFactory } from "@nestjs/core";
// Loads .env before app.module.js reads process.env
import "dotenv/config";
import helmet from "helmet";

import { AppModule } from "./app.module.js";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT ?? 3000;

  app.use(helmet());
  app.enableCors();
  // Lets modules close database connections when the process is stopped
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}
    Health: http://localhost:${port}/health
    `);
}

void bootstrap();
