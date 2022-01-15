import { Scenes, session, Composer } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import { pleaseSendMessage, sendedMessage } from "../common/message";
import { anonymousType, first_text } from "../../data/json/message.json";
import { leaveEditMessage, leave } from "./leave";
import { adminsChatIds, commands } from "../../data/json/config.json";
import { inCorrect } from "../../data/json/message.json";
import { saveMessageIdsDB } from "../db/save";
import { messageIds } from "../common/type";
import { checkErrorCode } from "../common/checkError";

// 1. edit to please send me your message
// 2. wait to user send message...
async function getMessageEdit(ctx: Context) {
  if (
    !(
      pleaseSendMessage.text != undefined &&
      pleaseSendMessage.inlineKeyboard != undefined
    )
  ) {
    leave(ctx);
    return;
  }

  // type of anonymous message
  const type: "look" | "voice" | "anonymous" | "reporter" = (<any>ctx)
    .callbackQuery.data;

  var message: string;
  switch (type) {
    case "look":
      message = pleaseSendMessage.text.look;
      break;
    case "voice":
      message = pleaseSendMessage.text.voice;
      break;
    case "reporter":
      message = pleaseSendMessage.text.reporter;
      break;
    default:
      message = pleaseSendMessage.text.anonymous;
  }
  // 1. edit to please send me your message
  ctx
    .editMessageText(message, {
      reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
    })
    .then((replyMessage) => {
      (<any>ctx).wizard.state.message = {
        replyedMessage: replyMessage,
        anonymousType: type,
      };
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });

  // 2. wait to user send message...
  return (<any>ctx).wizard.next();
}

// 1. send copy to admins
// 2. send ok to user
// 3. save message id in db
async function sendToAdmin(ctx: Context) {
  if (ctx.from === undefined) return;

  var menu = [
    [
      {
        text: "حذف ❌",
        callback_data: "deleteMessage",
      },
      {
        text: "پاسخ ✉️",
        callback_data: "reply",
      },
    ],
    [
      {
        text: "ارسال‌به‌آرشیو 📲",
        callback_data: "sendToArchive",
      },
      {
        text: "ارسال‌به‌شائق ✌🏻",
        callback_data: "directSending",
      },
    ],
    [
      {
        text: String(ctx.from.id),
        callback_data: "none",
      },
    ],
  ];

  // if message have command
  if (commands.includes((<any>ctx).message.text)) {
    leave(ctx);
    ctx
      .reply(inCorrect, { reply_to_message_id: ctx.message?.message_id })
      .catch((err) => {
        checkErrorCode(ctx, err, false);
      });

    // delete inline keyboard last message
    const replyMessage = (<any>ctx).wizard.state.message.replyedMessage;

    bot.telegram
      .editMessageReplyMarkup(ctx.from.id, replyMessage.message_id, undefined, {
        inline_keyboard: [],
      })
      .catch((err) => {
        checkErrorCode(ctx, err, false);
      });
    return;
  }

  // 1. delete last message inline keyboard
  const replyMessage = (<any>ctx).wizard.state.message.replyedMessage;
  bot.telegram
    .editMessageReplyMarkup(ctx.from.id, replyMessage.message_id, undefined, {
      inline_keyboard: [],
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });

  // get message id and message id admins
  var adminChatIds: Array<number> = [];
  var adminMessageIds: Array<number> = [];
  // 2. send copy to admins

  // let userChatID = ctx.from.id;
  // if (ctx.from === undefined) return;
  const userChatID = `#u${ctx.from.id}`;
  for (const adminChatID of adminsChatIds) {
    const exit = await ctx
      .copyMessage(adminChatID)
      .then((messageID) => {
        adminChatIds.push(adminChatID);
        adminMessageIds.push(messageID.message_id);

        // get type of anonymous from state
        var type: "anonymous" | "reporter" | "look" | "voice" = "anonymous";
        type = (<any>ctx).wizard.state.message.anonymousType;

        // edit message and add hashtag
        if ((<any>ctx).message.text != undefined) {
          bot.telegram.editMessageText(
            adminChatID,
            messageID.message_id,
            undefined,
            `${first_text}\n\n ${(<any>ctx).message.text}\n\n ${
              anonymousType[type]
            } \n\n${userChatID}`,
            {
              reply_markup: {
                inline_keyboard: menu,
              },
              disable_web_page_preview: true,
            }
          );
        } else {
          var text = (<any>ctx).message.caption;
          if (text != undefined) {
            text = `${first_text}\n\n ${(<any>ctx).message.caption}\n\n ${
              anonymousType[type]
            } \n\n${userChatID}`;
          } else {
            text = `${anonymousType["look"]} \n\n${userChatID}`;
          }

          bot.telegram.editMessageCaption(
            adminChatID,
            messageID.message_id,
            undefined,
            text,
            {
              reply_markup: {
                inline_keyboard: menu,
              },
            }
          );
        }
      })
      .catch((err) => {
        checkErrorCode(ctx, err, true);
        return true;
      });

    if (exit === true) return;
  }

  // 3. get message id and chat id admins
  if (
    sendedMessage.text === undefined ||
    sendedMessage.inlineKeyboard === undefined ||
    ctx.message === undefined
  )
    return;

  var type: "anonymous" | "reporter" | "look" | "voice";
  type = (<any>ctx).wizard.state.message.anonymousType;

  var message: string;
  switch (type) {
    case "look":
      message = sendedMessage.text.look;
      break;
    case "voice":
      message = sendedMessage.text.voice;
      break;
    case "reporter":
      message = sendedMessage.text.reporter;
      break;
    default:
      message = sendedMessage.text.anonymous;
  }

  // 4. sened ok | REPLY
  ctx
    .reply(message, {
      reply_to_message_id: ctx.message.message_id,
      reply_markup: { inline_keyboard: sendedMessage.inlineKeyboard },
    })
    .then((replyMessageId) => {
      // 3. save messageid in database
      saveMessageIds(ctx, replyMessageId, adminChatIds, adminMessageIds);
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });

  return (<any>ctx).scene.leave();
}

// save message id in db
async function saveMessageIds(
  ctx: Context,
  replyMessageId: any,
  adminChatIds: Array<number>,
  adminMessageIds: Array<number>
) {
  if (ctx.from === undefined || ctx.message === undefined) return;
  var messagesids: messageIds = {
    mainMessageId: ctx.message.message_id,
    replyMessageId: replyMessageId.message_id,
    reciverChatIds: adminChatIds,
    reciverMessageIds: adminMessageIds,
    senderChatId: ctx.from.id,
  };
  saveMessageIdsDB(messagesids);
}

const getMessage = new Composer<Scenes.WizardContext>();

getMessage.action("anonymous", (ctx) => {
  getMessageEdit(ctx);
});

getMessage.action("reporter", (ctx) => {
  getMessageEdit(ctx);
});

getMessage.action("look", (ctx) => {
  getMessageEdit(ctx);
});

getMessage.action("voice", (ctx) => {
  getMessageEdit(ctx);
});

// wizard
const superWizard = new Scenes.WizardScene(
  "anonymous",
  getMessage,
  sendToAdmin
);

const stage = new Scenes.Stage<Scenes.WizardContext>([superWizard], {
  default: "anonymous",
});

bot.use(session());
bot.use(<any>stage.middleware());

// leave from
superWizard.action("leave", leaveEditMessage);
