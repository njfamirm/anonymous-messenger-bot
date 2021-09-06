import bot from "../common/bot";
import { Context } from "telegraf";

// send copy of message to channel and delete from admin pv
async function sendToChannel(ctx: Context) {
  ctx.copyMessage("@njfamirm256");
  // TODO
  // delete from user and admin function
}

bot.action("sendToChannel", sendToChannel);
