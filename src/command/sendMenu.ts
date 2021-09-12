import { Context } from "telegraf";
import { bot } from "../common/bot";
import { sendMessage } from "../common/sendmessage";
import { mainMenuMessage } from "../common/message";

// edit menu to user
export async function editToMenu(ctx: Context) {
  if (
    mainMenuMessage.text != undefined &&
    mainMenuMessage.inlineKeyboard != undefined
  ) {
    ctx.editMessageText(mainMenuMessage.text, {
      reply_markup: { inline_keyboard: mainMenuMessage.inlineKeyboard },
    });
  }
}

// send menu to message
export async function sendMenuMessage(ctx: Context) {
  const user = ctx.from;
  if (user != undefined) {
    sendMessage(user.id, mainMenuMessage);
  }
}

bot.action("menu", editToMenu);
bot.command("menu", sendMenuMessage);
bot.action("sendMenu", (ctx: Context) => {
  ctx.editMessageReplyMarkup(undefined);
  sendMenuMessage(ctx);
});
