import bot from "../common/bot";
import { Context } from "telegraf";
import { deleteMessageSentByAdmin } from "./delete";
import { channelID } from "../../data/json/config.json";
import { checkErrorCode } from "../common/checkError";

var regex = new RegExp(`https:\/\/t.me/${channelID}\/\d*`);

// 1. send copy of message to channel
// 2. delete reply markup ( send to channel from admins & delete from user )
async function sendToChannel(ctx: Context) {
  if (ctx.from === undefined) return;

  const postReplyLink = checkReply(ctx);
  if (postReplyLink) {
    const exit = await ctx
      .copyMessage(`@${channelID}`, {
        reply_to_message_id: parseInt(
          postReplyLink.replace(`https://t.me/${channelID}/`, "")
        ),
      })
      .catch((err) => {
        checkErrorCode(ctx, err, true);
        return true;
      });

    if (exit === true) return;
  } else {
    const exit = await ctx.copyMessage(`@${channelID}`).catch((err) => {
      checkErrorCode(ctx, err, true);
      return true;
    });
    if (exit === true) return;
  }
  deleteMessageSentByAdmin(ctx);
}

// check post link exists in text
function checkReply(ctx: Context) {
  const text: string = (<any>ctx).update.callback_query.message.text;
  return regex.exec(text)?.input;
}

bot.action("sendToChannel", sendToChannel);
