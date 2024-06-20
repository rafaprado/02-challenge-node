import { Knex } from "knex"
import { env } from "./src/env";

const config: Knex.Config = {
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./db/migrations",
    extension: "ts"
  }
}

export default config;