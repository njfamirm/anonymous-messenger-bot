import bot from "../common/bot";
import { Context } from "telegraf";
import { deleteMessageSentByAdmin } from "./delete";

// 1. send copy of message to channel
// 2. delete reply markup ( send to channel from admins & delete from user )
async function sendToChannel(ctx: Context) {
  ctx.copyMessage("@njfamirm256");
  deleteMessageSentByAdmin(ctx);
}

bot.action("sendToChannel", sendToChannel);
