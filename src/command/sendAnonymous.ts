import { Scenes, session, Composer } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import {
  pleaseSendMessage,
  sendedMessage,
  sendToAdminMenu,
} from "../common/message";
import { anonymousType } from "../../data/json/message.json";
import { leaveEditMessage, leave } from "./leave";
import { adminsChatIds, commands } from "../../data/json/config.json";
import { inCorrect } from "../../data/json/message.json";
import { saveMessageIdsDB } from "../db/save";
import { messageIds } from "../common/type";
import { checkErrorCode } from "../common/checkError";
import { Menu } from "../common/type";

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
  const type: string = (<any>ctx).callbackQuery.data;

  // 1. edit to please send me your message
  ctx
    .editMessageText(pleaseSendMessage.text, {
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

async function getMessageSend(ctx: Context) {
  if (
    !(
      pleaseSendMessage.text != undefined &&
      pleaseSendMessage.inlineKeyboard != undefined
    )
  )
    return;

  // 1. edit to please send me your message
  ctx
    .reply(pleaseSendMessage.text, {
      reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
      reply_to_message_id: ctx.message?.message_id,
    })
    .then((replyedMessage) => {
      (<any>ctx).wizard.state.message = { replyedMessage: replyedMessage };
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

  // // add chatid button
  // var newSendToAdminMenu: Menu = sendToAdminMenu;
  // newSendToAdminMenu[1].push({
  //   text: String(ctx.from?.id),
  //   callback_data: "none",
  // });

  // 2. send copy to admins
  for (const adminChatID of adminsChatIds) {
    const exit = await ctx
      .copyMessage(adminChatID)
      .then((messageID) => {
        adminChatIds.push(adminChatID);
        adminMessageIds.push(messageID.message_id);

        // get type of anonymous from state
        var type: "anonymous" | "reporter" | "eager" = "anonymous";
        type = (<any>ctx).wizard.state.message.anonymousType;

        // edit message and add hashtag
        if ((<any>ctx).message.text != undefined) {
          bot.telegram.editMessageText(
            adminChatID,
            messageID.message_id,
            undefined,
            `${(<any>ctx).message.text}\n\n ${anonymousType[type]}`,
            {
              reply_markup: {
                inline_keyboard: sendToAdminMenu,
              },
            }
          );
        } else {
          var text = (<any>ctx).message.caption;
          if (text != undefined) {
            text = `${(<any>ctx).message.caption}\n\n ${anonymousType[type]}`;
          } else {
            text = `${anonymousType[type]}`;
          }

          bot.telegram.editMessageCaption(
            adminChatID,
            messageID.message_id,
            undefined,
            text,
            {
              reply_markup: {
                inline_keyboard: sendToAdminMenu,
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

  // 4. sened ok | REPLY
  ctx
    .reply(sendedMessage.text, {
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

getMessage.action("eager", (ctx) => {
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
