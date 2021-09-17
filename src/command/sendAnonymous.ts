import { Scenes, session, Composer } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import {
  pleaseSendMessage,
  sendedMessage,
  sendToAdminMenu,
} from "../common/message";
import { leaveEditMessage, leave } from "./leave";
import { adminsChatIds, commands } from "../../data/json/config.json";
import { inCorrect } from "../../data/json/message.json";
import { saveMessageIdsDB } from "../db/save";
import { messageIds } from "../common/type";

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

  // 1. edit to please send me your message
  const replyedMessage = await ctx.editMessageText(pleaseSendMessage.text, {
    reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
  });

  (<any>ctx).wizard.state.message = { replyedMessage: replyedMessage };

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
  const replyedMessage = await ctx.reply(pleaseSendMessage.text, {
    reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
    reply_to_message_id: ctx.message?.message_id,
  });

  (<any>ctx).wizard.state.message = { replyedMessage: replyedMessage };

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
    ctx.reply(inCorrect, { reply_to_message_id: ctx.message?.message_id });

    // delete inline keyboard last message
    const replyMessage = (<any>ctx).wizard.state.message.replyedMessage;
    bot.telegram.editMessageReplyMarkup(
      ctx.from.id,
      replyMessage.message_id,
      undefined,
      { inline_keyboard: [] }
    );

    return;
  }

  // 1. delete last message inline keyboard
  const replyMessage = (<any>ctx).wizard.state.message.replyedMessage;
  bot.telegram.editMessageReplyMarkup(
    ctx.from.id,
    replyMessage.message_id,
    undefined,
    { inline_keyboard: [] }
  );

  // get message id and message id admins
  var adminChatIds: Array<number> = [];
  var adminMessageIds: Array<number> = [];

  // 2. send copy to admins
  for (const adminChatID of adminsChatIds) {
    var messageId = await ctx.copyMessage(adminChatID, {
      reply_markup: { inline_keyboard: sendToAdminMenu },
    });
    // 3. get message id and chat id admins
    adminChatIds.push(adminChatID);
    adminMessageIds.push(messageId.message_id);
  }

  if (
    sendedMessage.text === undefined ||
    sendedMessage.inlineKeyboard === undefined ||
    ctx.message === undefined
  )
    return;

  // 4. sened ok | REPLY
  const replyMessageId = await ctx.reply(sendedMessage.text, {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: { inline_keyboard: sendedMessage.inlineKeyboard },
  });

  // 3. save messageid in database
  saveMessageIds(ctx, replyMessageId, adminChatIds, adminMessageIds);

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

getMessage.command("anonymous", (ctx) => {
  getMessageSend(ctx);
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
