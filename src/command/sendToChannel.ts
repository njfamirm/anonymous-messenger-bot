import { bot } from "../common/bot";
import { Context } from "telegraf";
import { deleteMessageId } from "../common/saveMeessageId";

// 1. send copy of message to channel
// 2. delete reply markup ( send to channel from admins & delete from user )
async function sendToChannel(ctx: Context) {
  ctx.copyMessage("@njfamirm256");
  // TODO
  // delete from user and admin function
  deleteMessageId(ctx);
}

bot.action("sendToChannel", sendToChannel);
