import { drizzle } from "drizzle-orm/node-postgres";

export type Env = {
  Variables: {
    db: ReturnType<typeof drizzle>;
  };
};
