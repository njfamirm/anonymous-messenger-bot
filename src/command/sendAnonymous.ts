import { Scenes, session } from "telegraf";
import bot from "../common/bot";
import { Context } from "telegraf";
import { Message } from "../common/type";
import { sendMessage } from "../common/sendmessage";
import { ReplyMessage } from "../common/type";
import { sendToAdminMenu, sendedMenu } from "../common/Menu";
import { adminList } from "../common/data";
import { sendMainMenu } from "./sendMenu";

// please send message
const pleaseSend: Message = {
  type: "text",
  text: "please send me...",
};

// ok mwssage when sended to admin
const sended: ReplyMessage = {
  text: "sended",
  inlineKeyboard: sendedMenu,
};

// send message to user for user send message
async function getMessage(ctx: Context) {
  // please send ...
  const user = ctx.from;
  if (user?.id != undefined) {
    sendMessage(user.id, pleaseSend);
  }

  return (<any>ctx).wizard.next();
}

async function sendToAdmin(ctx: Context) {
  const user = ctx.from;
  if (user?.id != undefined && ctx.message != undefined) {
    // 1. send to all admin
    for (const adminChatID of adminList) {
      bot.telegram.copyMessage(adminChatID, user.id, ctx.message.message_id, {
        reply_markup: { inline_keyboard: sendToAdminMenu },
        // TODO
        // group media!
      });
    }
    // 2. sened | REPLY
    ctx.reply(sended.text, {
      reply_to_message_id: ctx.message.message_id,
      reply_markup: { inline_keyboard: sended.inlineKeyboard },
    });
    // save data in db

    sendMainMenu(ctx);

    return (<any>ctx).scene.leave();
  }
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
