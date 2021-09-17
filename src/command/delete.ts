import { Context } from "telegraf";
import bot from "../common/bot";
import {
  findMessageIdByUserQuery,
  findMessageIdByAdminQuery,
} from "../../data/json/databaseQuery.json";
import { QueryConfig, QueryResult } from "pg";
import { pool } from "../db/config";
import { deleted } from "../../data/json/message.json";
import log from "../common/log";
import { replyUserMenu } from "../common/message";

// delete message sent from user to admins by user
// delete delete inline keyboard
async function deleteMessageSent(ctx: Context) {
  const query: QueryConfig = {
    text: findMessageIdByUserQuery,
    values: [
      String(ctx.from?.id),
      String((<any>ctx).update.callback_query.message.message_id),
    ],
  };

  // 1. get message ids
  await pool
    .query(query)
    .then((resp: QueryResult) => {
      // 2. get and delete message from db
      // 3. delete message from admin & edit replyed message
      deleteFromRecivers(resp.rows[0]);
    })
    .catch((err) => {
      log(err);
    });
}

// delete send to channel inline keyboard
// delete delete inline keyboard
export async function deleteMessageSentByAdmin(ctx: Context) {
  const query: QueryConfig = {
    text: findMessageIdByAdminQuery,
    values: [
      String(ctx.from?.id),
      String((<any>ctx).update.callback_query.message.message_id),
    ],
  };

  // 1. get message ids
  await pool
    .query(query)
    .then((resp: QueryResult) => {
      // 2. get and delete message from db
      // 3. edit all message
      console.log(resp);
      deleteFromReciver(resp.rows[0]);
    })
    .catch((err) => {
      log(err);
    });
}

function deleteFromReciver(messageIds: any) {
  // 1. delete message sent to admin
  for (var i = 0; i < messageIds.reciverchatids.length; i++) {
    bot.telegram.editMessageReplyMarkup(
      messageIds.reciverchatids[i],
      messageIds.recivermessageids[i],
      undefined,
      { inline_keyboard: replyUserMenu }
    );
  }

  // 2. delete replyed inline keyboard
  bot.telegram.editMessageReplyMarkup(
    messageIds.senderchatid,
    messageIds.replymessageid,
    undefined,
    { inline_keyboard: [] }
  );
}

// edit message from user
// and delete messages from admin
function deleteFromRecivers(messageIds: any) {
  // 1. delete message sent to admin
  for (var i = 0; i < messageIds.reciverchatids.length; i++) {
    bot.telegram.deleteMessage(
      messageIds.reciverchatids[i],
      messageIds.recivermessageids[i]
    );
  }

  // 2. delete replyed inline keyboard
  bot.telegram.editMessageText(
    messageIds.senderchatid,
    messageIds.replymessageid,
    undefined,
    deleted,
    { reply_markup: { inline_keyboard: [] } }
  );
}

bot.action("delete", deleteMessageSent);
