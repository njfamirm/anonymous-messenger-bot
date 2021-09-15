import { Context } from "telegraf";
import { sendMessage } from "../common/sendmessage";
import bot from "../common/bot";
import { startMessage } from "../common/message";
import addUser from "../db/json/addUser";

// send start message
async function start(ctx: Context) {
  const user = ctx.from;
  if (user?.id != undefined && ctx.message != undefined) {
    sendMessage(user.id, startMessage);
    addUserToDB(ctx);
  }
}

// add user information to db
function addUserToDB(ctx: Context) {
  if (ctx.from != undefined) {
    addUser.set(String(ctx.from?.id), {
      userName: ctx.from.username,
      name: ctx.from.first_name + ctx.from.last_name,
    });
  }
}

bot.command("start", start);
