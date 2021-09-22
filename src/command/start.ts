import { Context } from "telegraf";
import bot from "../common/bot";
import { startMessage } from "../common/message";
import { userDB } from "../db/json/db";
import log from "../common/log";
import { checkErrorCode } from "../common/checkError";

// send start message
async function start(ctx: Context) {
  if (
    startMessage.text === undefined ||
    startMessage.inlineKeyboard === undefined
  )
    return;
  ctx
    .reply(startMessage.text, {
      reply_markup: { inline_keyboard: startMessage.inlineKeyboard },
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
      return;
    });
  addUserToDB(ctx);
}

// add user information to db
function addUserToDB(ctx: Context) {
  if (ctx.from != undefined) {
    userDB
      .set(String(ctx.from?.id), {
        userName: ctx.from.username,
        name: ctx.from.first_name + ctx.from.last_name,
      })
      .catch((err) => {
        log(err);
      });
  }
}

bot.command("start", start);
