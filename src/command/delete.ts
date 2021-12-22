import { Context } from "telegraf";
import bot from "../common/bot";
import {
  findMessageIdByUserQuery,
  findMessageIdByAdminQuery,
} from "../../data/json/databaseQuery.json";
import { QueryConfig, QueryResult } from "pg";
import { pool } from "../db/config";
import { deleted } from "../../data/json/message.json";
import { replyUserMenu } from "../common/message";
import { checkErrorCode } from "../common/checkError";

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
  pool
    .query(query)
    .then((resp: QueryResult) => {
      // 2. get and delete message from db
      // 3. delete message from admin & edit replyed message
      deleteFromRecivers(ctx, resp.rows[0]);
    })
    .catch((err) => {
      // fix bug
      checkErrorCode(ctx, err, false);
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
  pool
    .query(query)
    .then((resp: QueryResult) => {
      // 2. get and delete message from db
      // 3. edit all message
      deleteFromReciver(ctx, resp.rows[0]);
    })
    .catch((err) => {
      // fix bug
      checkErrorCode(ctx, err, false);
    });
}

async function deleteFromReciver(ctx: Context, messageIds: any) {
  // 1. delete message sent to admin
  for (var i = 0; i < messageIds.reciverchatids.length; i++) {
    var exit = await bot.telegram
      .editMessageReplyMarkup(
        messageIds.reciverchatids[i],
        messageIds.recivermessageids[i],
        undefined,
        { inline_keyboard: replyUserMenu }
      )
      .catch((err) => {
        checkErrorCode(ctx, err, false);
      });
  }
  if (exit === true) return;

  // 2. delete replyed inline keyboard
  bot.telegram
    .editMessageReplyMarkup(
      messageIds.senderchatid,
      messageIds.replymessageid,
      undefined,
      { inline_keyboard: [] }
    )
    .catch((err) => {
      checkErrorCode(ctx, err, true);
    });
}

// edit message from user
// and delete messages from admin
function deleteFromRecivers(ctx: Context, messageIds: any) {
  // 1. delete message sent to admin
  for (var i = 0; i < messageIds.reciverchatids.length; i++) {
    bot.telegram
      .deleteMessage(
        messageIds.reciverchatids[i],
        messageIds.recivermessageids[i]
      )
      .catch((err) => {
        checkErrorCode(ctx, err, true);
      });
  }

  // 2. delete replyed inline keyboard
  bot.telegram
    .editMessageText(
      messageIds.senderchatid,
      messageIds.replymessageid,
      undefined,
      deleted,
      { reply_markup: { inline_keyboard: [] } }
    )
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });
}

// delete from bot by admin
function deleteByAdmin(ctx: Context) {
  const query: QueryConfig = {
    text: findMessageIdByAdminQuery,
    values: [
      String(ctx.from?.id),
      String((<any>ctx).update.callback_query.message.message_id),
    ],
  };

  // 1. get message ids
  pool
    .query(query)
    .then((resp: QueryResult) => {
      var adminChatID: Array<number> = resp.rows[0].reciverchatids;
      for (const chatID of adminChatID) {
        bot.telegram.deleteMessage(
          chatID,
          resp.rows[0].recivermessageids[adminChatID.indexOf(chatID)]
        );
      }
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });
}

bot.action("delete", deleteMessageSent);
bot.action("deleteMessage", deleteByAdmin);
