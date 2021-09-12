import { Context } from "telegraf";
import { OneDB } from "../db/1db";
import { bot } from "./bot";
import { sendedToChannelMenu, sendMenuMenu } from "./message";
import { messageSendedId } from "./type";

const messageIdDbPath = "./data/json/messageid.json";
const messageIdDb = new OneDB(messageIdDbPath);

// save message id in db
// not compelete
export function saveMessageId(messagesid: any) {
  for (var adminMessageId of messagesid.admin) {
    messageIdDb.set(String(adminMessageId[0]), messagesid);
  }
  messageIdDb.set(messagesid.userChatId, messagesid);
}

// delete reply markup from user and admins sended to channel
export async function deleteMessageId(ctx: Context) {
  // get message ids
  if (ctx.from === undefined) return;
  const messageIds = await messageIdDb.get<messageSendedId>(
    String(ctx.from.id)
  );

  // delete reply markup (send to channel) from admins
  if (messageIds === undefined) return;
  for (var adminChatId of messageIds.admin) {
    bot.telegram.editMessageReplyMarkup(
      adminChatId[0],
      adminChatId[1],
      undefined,
      { inline_keyboard: sendedToChannelMenu }
    );
  }

  // delete reply markup (delete)
  bot.telegram.editMessageReplyMarkup(
    messageIds.userChatId,
    messageIds.replyMessageId,
    undefined,
    { inline_keyboard: sendMenuMenu }
  );
}
