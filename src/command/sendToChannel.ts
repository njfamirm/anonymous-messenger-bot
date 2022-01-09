import bot from "../common/bot";
import { Context } from "telegraf";
import { deleteMessageSentByAdmin } from "./delete";
import { privateChannelID, publicChannelID } from "../../data/json/config.json";
import { checkErrorCode } from "../common/checkError";
import { sendToChannel } from "../../data/json/message.json";

const regex = /https:\/\/t\.me\/shaegh_ir\/\d*/gm;

async function indirectSending(ctx: Context) {
  if (ctx.from === undefined) return;

  const text = (<any>ctx).update.callback_query.message.text;
  let caption = (<any>ctx).update.callback_query.message.caption;
  let caption2 = "";
  if ((<any>ctx).update.callback_query.message.text != undefined) {
    ctx
      .editMessageText(text.substring(0, text.lastIndexOf("\n")))
      .then(async () => {
        const postReplyLink = checkReply(ctx);
        if (postReplyLink != null && postReplyLink[0] != undefined) {
          const exit = await ctx
            .copyMessage(`@${publicChannelID}`, {
              reply_to_message_id: parseInt(
                postReplyLink[0].replace(`https://t.me/${publicChannelID}/`, "")
              ),
            })
            .then(() => {
              ctx.editMessageText(text);
            })

            .catch((err) => {
              checkErrorCode(ctx, err, true);
              return true;
            });

          if (exit === true) return;
        } else {
          const exit = await ctx
            .copyMessage(`@${publicChannelID}`)
            .then(() => {
              ctx.editMessageText(text);
            })
            .catch((err) => {
              checkErrorCode(ctx, err, true);
              return true;
            });
          if (exit === true) return;
        }
      });
  } else {
    if (!caption) {
      caption2 = "";
    } else {
      caption2 = caption.substring(0, caption.lastIndexOf("\n"));
    }
    ctx.editMessageCaption(caption2).then(async () => {
      const postReplyLink = checkReply(ctx);
      if (postReplyLink != null && postReplyLink[0] != undefined) {
        const exit = await ctx
          .copyMessage(`@${publicChannelID}`, {
            reply_to_message_id: parseInt(
              postReplyLink[0].replace(`https://t.me/${publicChannelID}/`, "")
            ),
          })
          .then(() => {
            ctx.editMessageCaption(caption);
          })
          .catch((err) => {
            checkErrorCode(ctx, err, true);
            return true;
          });

        if (exit === true) return;
      } else {
        const exit = await ctx
          .copyMessage(`@${publicChannelID}`)
          .then(() => {
            ctx.editMessageCaption(caption);
          })
          .catch((err) => {
            checkErrorCode(ctx, err, true);
            return true;
          });
        if (exit === true) return;
      }
    });
  }
}

// 1. send copy of message to channel
// 2. delete reply markup ( send to channel from admins & delete from user )
async function sendToPublicChannel(ctx: Context) {
  if (ctx.from === undefined) return;

  const postReplyLink = checkReply(ctx);
  if (postReplyLink != null && postReplyLink[0] != undefined) {
    const exit = await ctx
      .copyMessage(`@${publicChannelID}`, {
        reply_to_message_id: parseInt(
          postReplyLink[0].replace(`https://t.me/${publicChannelID}/`, "")
        ),
      })

      .catch((err) => {
        checkErrorCode(ctx, err, true);
        return true;
      });

    if (exit === true) return;
  } else {
    const exit = await ctx.copyMessage(`@${publicChannelID}`).catch((err) => {
      checkErrorCode(ctx, err, true);
      return true;
    });
    if (exit === true) return;
  }
  sendToPrivateChannel(ctx, undefined);
}

async function sendToPrivateChannel(ctx: Context, menu: any) {
  if (ctx.from === undefined) return;
  var userChatID = (<any>ctx).update.callback_query.message.reply_markup
    .inline_keyboard[2][0].text;

  const exit = await ctx
    .copyMessage(privateChannelID)
    .then((chatID) => {
      if ((<any>ctx).update.callback_query.message.text != undefined) {
        bot.telegram.editMessageText(
          privateChannelID,
          chatID.message_id,
          undefined,
          (<any>ctx).update.callback_query.message.text + "\n\n" + userChatID,
          {
            disable_web_page_preview: true,
            reply_markup: { inline_keyboard: menu },
          }
        );
      } else {
        var message = (<any>ctx).update.callback_query.message.caption;
        if (!message) message = "";
        bot.telegram.editMessageCaption(
          privateChannelID,
          chatID.message_id,
          undefined,
          message + "\n\n" + userChatID,
          { reply_markup: { inline_keyboard: menu } }
        );
      }
    })
    .catch((err) => {
      checkErrorCode(ctx, err, true);
      return true;
    });

  if (exit === true) return;
  // }

  // delete message from private chat
  deleteMessageSentByAdmin(ctx);
}

// check post link exists in text
function checkReply(ctx: Context) {
  const text: string = (<any>ctx).update.callback_query.message.text;
  return regex.exec(text);
}

bot.action("indirectSending", indirectSending);
bot.action("directSending", sendToPublicChannel);
bot.action("sendToArchive", (ctx) => {
  sendToPrivateChannel(ctx, sendToChannel.inlineKeyboard);
});
