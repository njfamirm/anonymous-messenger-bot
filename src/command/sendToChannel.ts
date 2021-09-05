import bot from "../common/bot";
import { Context } from "telegraf";

// send copy of message to channel
async function sendToChannel(ctx: Context) {
  const user = ctx.from;
  if (ctx.callbackQuery != undefined) var messageID = ctx.callbackQuery.message?.message_id;
  if (user != undefined && messageID != undefined) {
    bot.telegram.copyMessage("@njfamirm256", user.id, messageID);
    // TODO
    // selete from other admin
    // edit user message -> delete reply message!
  }
}

bot.action("sendToChannel", sendToChannel);
