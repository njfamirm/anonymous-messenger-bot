import { Scenes, session } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import {
  pleaseSendMessage,
  sendedMessage,
  sendToAdminMenu,
} from "../common/message";
import { leave } from "./leave";

import { adminsChatIds } from "../../data/json/config.json";
import { saveMessageIdsDB } from "../db/save";
import log from "../common/log";
import { messageIds } from "../common/type";

// 1. edit to please send me your message
// 2. wait to user send message...
export async function getMessage(ctx: Context) {
  if (
    !(
      pleaseSendMessage.text != undefined &&
      pleaseSendMessage.inlineKeyboard != undefined
    )
  )
    return;

  // 1. edit to please send me your message
  const replyedMessage = await ctx.editMessageText(pleaseSendMessage.text, {
    reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
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
  console.log(messagesids);
  saveMessageIdsDB(messagesids);
}

// wizard
// 1. get message
// 2. send them to admin 3. reply to user message => ok
const superWizard = new Scenes.WizardScene(
  "anonymous",
  getMessage,
  sendToAdmin
);

const stage = new Scenes.Stage([<any>superWizard]);
bot.use(session()); // why??
bot.use(<any>stage.middleware());

// anonymous button on menu
bot.action("anonymous", (ctx: any /*Context*/) => {
  ctx.scene.enter("anonymous");
});

superWizard.action("leave", leave);
