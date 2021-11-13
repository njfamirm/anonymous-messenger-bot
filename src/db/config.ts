import { Pool } from "pg";
import { createTableQuery } from "../../data/json/databaseQuery.json";
import {logError, logInfo} from "../common/log";

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

pool.connect();

// create table in not exists
async function createTable() {
  await pool.query(createTableQuery).catch((err) => {
    logError(err.stack);
  });
}

createTable()
  .catch(() => {
    logError("error in creating table");
  });
