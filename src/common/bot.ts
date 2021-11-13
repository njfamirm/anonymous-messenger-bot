import { Telegraf } from "telegraf";

const token = process.env.TOKEN;

if (token === undefined) {
  console.log("token is required");
  process.exit(1);
}
export default new Telegraf(token);
