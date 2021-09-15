import { Context, session, Scenes } from "telegraf";
import bot from "../common/bot";
import { pleaseSendMessage, replyMenu } from "../common/message";
import { sendedMessage, deleteMenu } from "../common/message";
import { pool } from "../db/config";
import { findUserChatIdByAdminQuery } from "../../data/json/databaseQuery.json";
import { QueryConfig, QueryResult } from "pg";
import { messageIds } from "../common/type";
import { saveMessageIdsDB } from "../db/save";
import { leave } from "./sendAnonymous";
import log from "../common/log";

// get message
async function getMessage(ctx: Context) {
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
    reply_to_message_id: (<any>ctx).update.callback_query.message.message_id,
  });

  // send data to next step
  (<any>ctx).wizard.state.data = { ctx: ctx };
  (<any>ctx).wizard.state.message = { replyedMessage: replyedMessage };

  // 2. wait to user send message...
  return (<any>ctx).wizard.next();
}

// send copy of message to another user
async function sendToUser(ctx: Context) {
  if (ctx.message === undefined || ctx.from == undefined) return;

  // 1. delete last message inline keyboard
  const replyMessage = (<any>ctx).wizard.state.message.replyedMessage;
  bot.telegram.editMessageReplyMarkup(
    ctx.from.id,
    replyMessage.message_id,
    undefined,
    { inline_keyboard: [] }
  );

  // 2. get last message id
  const lastCtx = (<any>ctx).wizard.state.data.ctx;
  const query: QueryConfig = {
    text: findUserChatIdByAdminQuery,
    values: [
      String(lastCtx.from?.id),
      String(lastCtx.update.callback_query.message.message_id),
    ],
  };

  // 3. get message ids
  await pool
    .query(query)
    .then(async (resp: QueryResult) => {
      if (ctx.message === undefined || ctx.from === undefined) return;

      // 4. send copy of message to another user
      const senderchatid = resp.rows[0].senderchatid;
      const mainMessageId = resp.rows[0].mainmessageid;
      const adminMessageId = await ctx.copyMessage(senderchatid, {
        reply_markup: { inline_keyboard: replyMenu },
        reply_to_message_id: mainMessageId,
      });

      // 5. send ok to user
      if (sendedMessage.text === undefined) return;
      const replyMessageId = await ctx.reply(sendedMessage.text, {
        reply_markup: { inline_keyboard: deleteMenu },
        reply_to_message_id: ctx.message?.message_id,
      });

      // 6. save in db
      const messageids: messageIds = {
        mainMessageId: ctx.message.message_id,
        replyMessageId: replyMessageId.message_id,
        reciverChatIds: [senderchatid],
        reciverMessageIds: [adminMessageId.message_id],
        senderChatId: ctx.from.id,
      };
      saveMessageIdsDB(messageids);
    })
    .catch((err) => {
      log(err);
    });

  return (<any>ctx).scene.leave();
}

// wizard
// 1. get message
// 2. send them to another user 3. reply to user message => ok
const superWizard = new Scenes.WizardScene("Reply", getMessage, sendToUser);

const stage = new Scenes.Stage([<any>superWizard]);
bot.use(session()); // why??
bot.use(<any>stage.middleware());

// reply button on message
bot.action("reply", (ctx: Context) => {
  (<any>ctx).scene.enter("Reply");
});

superWizard.action("leave", leave);
