import { Pool } from "pg";
import { createTableQuery } from "../../data/json/databaseQuery.json";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

pool.connect();

// create table in not exists
async function createTable() {
  await pool.query(createTableQuery).catch((err) => {
    console.error(err.stack);
  });
}

createTable();
