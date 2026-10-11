import { Global, Inject, Module, type OnModuleDestroy } from "@nestjs/common";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

import * as schema from "./schema.js";

// Injection token for the Drizzle client: @Inject(DRIZZLE) private readonly db: Database
export const DRIZZLE = Symbol("DRIZZLE");

// $client is the connection pool that drizzle() creates from the URL
export type Database = NodePgDatabase<typeof schema> & { $client: Pool };

// Global so any module can inject the client without importing this one
@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: () => drizzle(process.env.DATABASE_URL!, { schema }),
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async onModuleDestroy(): Promise<void> {
    await this.db.$client.end();
  }
}
