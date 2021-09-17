import { Context } from "telegraf";
import bot from "../common/bot";
import { startMessage } from "../common/message";
import { userDB } from "../db/json/db";

// send start message
async function start(ctx: Context) {
  const user = ctx.from;
  if (
    startMessage.text === undefined ||
    startMessage.inlineKeyboard === undefined
  )
    return;
  ctx.reply(startMessage.text, {
    reply_markup: { inline_keyboard: startMessage.inlineKeyboard },
  });
  addUserToDB(ctx);
}

// add user information to db
function addUserToDB(ctx: Context) {
  if (ctx.from != undefined) {
    userDB.set(String(ctx.from?.id), {
      userName: ctx.from.username,
      name: ctx.from.first_name + ctx.from.last_name,
    });
  }
}

bot.command("start", start);
