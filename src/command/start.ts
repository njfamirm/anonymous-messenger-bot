import { Context } from "telegraf";
import { sendMessage } from "../common/handler";
import bot from "../common/bot";
import { chatID, Message } from "../common/type";
import { startMenu } from "../common/Menu";

const startMessage: Message = {
  type: "text",
  text: "Hello World!",
  inlineKeyboard: startMenu
};

// start command
async function start(ctx: Context) {
  const user = ctx.from;
  if (user?.id != undefined) {
    const chatid: chatID = user.id;
    await sendMessage(chatid, startMessage);
  }
}

bot.command("start", start);
bot.action("start", start);
