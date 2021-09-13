import { Telegraf } from "telegraf";
import log from "./log";

const token = process.env.TOKEN;

if (token === undefined) {
  log("token is required");
  process.exit(1);
}
export default new Telegraf(token);
