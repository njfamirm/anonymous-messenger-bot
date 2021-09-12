import { Context } from "telegraf";
import { sendMessage } from "../common/sendmessage";
import { bot } from "../common/bot";
import { startMessage } from "../common/message";

// send start message
async function start(ctx: Context) {
  const user = ctx.from;
  if (user?.id != undefined && ctx.message != undefined) {
    sendMessage(user.id, startMessage);
  }
}

bot.command("start", start);
