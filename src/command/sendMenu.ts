import { Context } from "telegraf";
import bot from "../common/bot";
import { mainMenuMessage } from "../common/message";
import { checkErrorCode } from "../common/checkError";

// edit menu to user
export async function editToMenu(ctx: Context) {
  if (
    mainMenuMessage.text != undefined &&
    mainMenuMessage.inlineKeyboard != undefined
  ) {
    ctx
      .editMessageText(mainMenuMessage.text, {
        reply_markup: { inline_keyboard: mainMenuMessage.inlineKeyboard },
      })
      .catch((err) => {
        checkErrorCode(ctx, err, false);
      });
  }
}

// send menu to message
export async function sendMenuMessage(ctx: Context) {
  if (
    mainMenuMessage.text === undefined ||
    mainMenuMessage.inlineKeyboard === undefined ||
    ctx.message === undefined
  )
    return;
  ctx
    .reply(mainMenuMessage.text, {
      reply_markup: { inline_keyboard: mainMenuMessage.inlineKeyboard },
      reply_to_message_id: ctx.message?.message_id,
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });
}

bot.action("menu", editToMenu);
bot.command("menu", sendMenuMessage);
bot.action("sendMenu", (ctx: Context) => {
  ctx.editMessageReplyMarkup(undefined);
  sendMenuMessage(ctx);
});
