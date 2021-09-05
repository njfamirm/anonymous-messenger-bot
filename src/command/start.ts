import { Context } from "telegraf";
import { sendMessage } from "../common/sendmessage";
import bot from "../common/bot";
import { Message } from "../common/type";
import { startMenu } from "../common/Menu";

const startMessage: Message = {
  type: "text",
  text: "Hello World!",
  inlineKeyboard: startMenu,
};

// start command
async function start(ctx: Context) {
  const user = ctx.from;
  if (user?.id != undefined && ctx.message != undefined) {
    sendMessage(user.id, startMessage);
  }
}

bot.command("start", start);