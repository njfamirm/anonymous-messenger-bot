import { Scenes, session } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import { sendToAdminMenu, deleteMenu } from "../common/Menu";
import { pleaseSend, sended, leaveMessage } from "../common/message";

import { adminList } from "../common/data";
import { sendMenuMessage } from "./sendMenu";

// edit to please send me your message
async function getMessage(ctx: Context) {
  if (!(pleaseSend.text != undefined && pleaseSend.inlineKeyboard != undefined))
    return;

  ctx.editMessageText(pleaseSend.text);
  ctx.editMessageReplyMarkup({ inline_keyboard: pleaseSend.inlineKeyboard });

  return (<any>ctx).wizard.next();
}

// send copy to admin
// send ok to user
async function sendToAdmin(ctx: Context) {
  // 1. send to all admin
  for (const adminChatID of adminList) {
    ctx.copyMessage(adminChatID, {
      reply_markup: { inline_keyboard: sendToAdminMenu },
    });
  }

  if (
    !(
      sended.text != undefined &&
      sended.inlineKeyboard != undefined &&
      ctx.message != undefined
    )
  )
    return;
  // 2. sened | REPLY
  ctx.reply(sended.text, {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: { inline_keyboard: sended.inlineKeyboard },
  });

  // save data in db

  return (<any>ctx).scene.leave();
}

async function sendMenu(ctx: Context) {
  ctx.editMessageReplyMarkup({ inline_keyboard: deleteMenu });
  sendMenuMessage(ctx);
}

// for leave from wizard
export async function leave(ctx: Context) {
  if (
    !(
      leaveMessage.text != undefined && leaveMessage.inlineKeyboard != undefined
    )
  )
    return;

  ctx.editMessageText(leaveMessage.text);
  ctx.editMessageReplyMarkup({
    inline_keyboard: leaveMessage.inlineKeyboard,
  });
  return (<any>ctx).scene.leave();
}

// wizard
// 1. get message
// 2. send them
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

bot.action("sendMenu", sendMenu);

superWizard.action("leave", leave);
