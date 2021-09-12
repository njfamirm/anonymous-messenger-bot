import { Telegraf } from "telegraf";
import log from "./log";

const token = process.env.token;

if (token === undefined) {
  log("token is required");
  process.exit(1);
}
export const bot = new Telegraf(token);
