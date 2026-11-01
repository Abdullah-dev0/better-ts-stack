import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // prisma generate needs no URL, so a build without .env (CI, a host) works.
    // Commands that connect report the empty URL
    url: process.env.DATABASE_URL ?? "",
  },
});
