import bot from "../common/bot";
import { Context } from "telegraf";
import { deleteMessageSentByAdmin } from "./delete";
import { privateChannelID, publicChannelID } from "../../data/json/config.json";
import { checkErrorCode } from "../common/checkError";
import { sendToChannel } from "../../data/json/message.json";
import { replyUserMenu } from "../common/message";

const regex = /https:\/\/t\.me\/shaegh_ir\/\d*/gm;

async function indirectSending(ctx: Context, menu: any) {
  if (ctx.from === undefined) return;

  const text = (<any>ctx).update.callback_query.message.text;
  let caption = (<any>ctx).update.callback_query.message.caption;
  let caption2 = "";
  if ((<any>ctx).update.callback_query.message.text != undefined) {
    ctx
      .editMessageText(text.substring(0, text.lastIndexOf("\n")), {
        disable_web_page_preview: true,
      })
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
              ctx.editMessageText(text, {
                reply_markup: { inline_keyboard: menu },
                disable_web_page_preview: true,
              });
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
              ctx.editMessageText(text, {
                reply_markup: { inline_keyboard: menu },
                disable_web_page_preview: true,
              });
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
            ctx.editMessageCaption(caption, {
              reply_markup: { inline_keyboard: menu },
            });
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
            ctx.editMessageCaption(caption, {
              reply_markup: { inline_keyboard: menu },
            });
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

async function sendToPrivateChannel(ctx: Context, menu: any) {
  const exit = await ctx
    .copyMessage(privateChannelID, { reply_markup: { inline_keyboard: menu } })
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

bot.action("indirectSending", (ctx) => {
  indirectSending(ctx, undefined);
});
bot.action("directSending", (ctx) => {
  sendToPrivateChannel(ctx, undefined);
  indirectSending(ctx, replyUserMenu);
});
bot.action("sendToArchive", (ctx) => {
  sendToPrivateChannel(ctx, sendToChannel.inlineKeyboard);
});
