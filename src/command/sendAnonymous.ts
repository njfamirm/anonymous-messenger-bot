import { Scenes, session } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import {
  pleaseSendMessage,
  sendedMessage,
  leaveMessage,
  sendToAdminMenu,
} from "../common/message";

import { admins } from "../../data/json/config.json";
import { saveMessageId } from "../common/saveMeessageId";
import log from "../common/log";

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
  await ctx.editMessageText(pleaseSendMessage.text, {
    reply_markup: { inline_keyboard: pleaseSendMessage.inlineKeyboard },
  });

  // 2. wait to user send message...
  return (<any>ctx).wizard.next();
}

// 1. send copy to admins
// 2. send ok to user
// 3. save message id in db
async function sendToAdmin(ctx: Context) {
  // get message id and message id | admins & user
  var admin: Array<Array<number>> = [];
  if (ctx.from === undefined || ctx.message === undefined) return;
  const mainMessageId: number = ctx.message.message_id;
  const userChatId: number = ctx.from.id;

  // 1. send copy to admins
  for (const adminChatID of admins.chatIds) {
    var mesageId = await ctx.copyMessage(adminChatID, {
      reply_markup: { inline_keyboard: sendToAdminMenu },
    });

    // get message id and chat id | admins
    if (ctx.from === undefined) {
      log("Error in get admin chat id | send anonymous breaked");
      return;
    }
    admin.push([ctx.from.id, mesageId.message_id]);
  }

  if (
    !(
      sendedMessage.text != undefined &&
      sendedMessage.inlineKeyboard != undefined &&
      ctx.message != undefined
    )
  ) {
    log("Error in send ok to user");
    return;
  }

  // 2. sened ok | REPLY
  const replyMessageId = await ctx.reply(sendedMessage.text, {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: { inline_keyboard: sendedMessage.inlineKeyboard },
  });

  // 3. save messageid in database
  var messagesids = {
    mainMessageId: mainMessageId,
    replyMessageId: replyMessageId.message_id,
    admin: admin,
    userChatId: userChatId,
  };
  saveMessageId(messagesids);

  return (<any>ctx).scene.leave();
}

// for leave from wizard
export async function leave(ctx: Context) {
  if (
    !(
      leaveMessage.text != undefined && leaveMessage.inlineKeyboard != undefined
    )
  ) {
    log("Error in leave from anonymous");
    return;
  }

  ctx.editMessageText(leaveMessage.text, {
    reply_markup: { inline_keyboard: leaveMessage.inlineKeyboard },
  });

  return (<any>ctx).scene.leave();
}

// wizard
// 1. get message
// 2. send them to admin 3. reply to user message => ok
const superWizard = new Scenes.WizardScene(
  "getMessage",
  getMessage,
  sendToAdmin
);

const stage = new Scenes.Stage([<any>superWizard]);
bot.use(session()); // why??
bot.use(<any>stage.middleware());

// anonymous button on menu
bot.action("anonymous", (ctx: any /*Context*/) => {
  ctx.scene.enter("getMessage");
});

superWizard.action("leave", leave);
