import { Context } from "telegraf";
import bot from "../common/bot";
import { sendMessage } from "../common/sendmessage";
import { mainMenuMessage } from "../common/message";


export async function editToMenu(ctx: Context) {
  if (
    mainMenuMessage.text != undefined &&
    mainMenuMessage.inlineKeyboard != undefined
  ) {
    ctx.editMessageText(mainMenuMessage.text);
    ctx.editMessageReplyMarkup({
      inline_keyboard: mainMenuMessage.inlineKeyboard,
    });
  }
}

export async function sendMenuMessage(ctx: Context) {
  const user = ctx.from;
  if (user != undefined) {
    sendMessage(user.id, mainMenuMessage);
  }
}

bot.action("menu", editToMenu);
