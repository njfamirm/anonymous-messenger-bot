import { Context } from "telegraf";
import bot from "../common/bot";
import { sendMessage } from "../common/sendmessage";
import { Message } from "../common/type";
import { mainMenu } from "../common/Menu";

const mainMenuMessage: Message = {
    type: "text",
    text: "Hello World!",
    inlineKeyboard: mainMenu,
  };

export async function sendMainMenu(ctx: Context) {
    const user = ctx.from;
    if (user?.id != undefined && ctx.message != undefined) {
      sendMessage(user.id, mainMenuMessage);
    }
}

bot.command("menu", sendMainMenu)