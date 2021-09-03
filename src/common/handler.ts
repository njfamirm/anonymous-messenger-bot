import { readFileSync } from "fs";
import bot from "./bot";
import { photosPath } from "./data";
import { Message, chatID } from "./type";

// send message handler
export async function sendMessage(chatid: chatID, message: Message) {
  switch (message.type) {
    case "text":
      // if text empty, break
      if (message.text == undefined) {
        break;
      }

      // text message with inline keyboard
      if (message.inlineKeyboard != undefined) {
        await bot.telegram.sendChatAction(chatid, "typing");
        await bot.telegram.sendMessage(chatid, message.text, {
          reply_markup: { inline_keyboard: message.inlineKeyboard },
        });
        break;
        // just text
      } else {
        await bot.telegram.sendChatAction(chatid, "typing");
        await bot.telegram.sendMessage(chatid, message.text);
        break;
      }

    // uploda photo
    case "photo":
      // if not have photo, break
      if (message.fileName == undefined) {
        break;
      }

      // with inline keyboard & text
      if (message.inlineKeyboard != undefined && message.text != undefined) {
        await bot.telegram.sendChatAction(chatid, "upload_photo");
        await bot.telegram.sendPhoto(
          chatid,
          { source: readFileSync(photosPath + message.fileName) },
          {
            caption: message.text,
            reply_markup: { inline_keyboard: message.inlineKeyboard },
          }
        );
        break;
        // with text
      } else if (message.text != undefined) {
        await bot.telegram.sendChatAction(chatid, "upload_photo");
        await bot.telegram.sendPhoto(
          chatid,
          { source: readFileSync(photosPath + message.fileName) },
          { caption: message.text }
        );
        break;
        // with inline keyboard
      } else if (message.inlineKeyboard != undefined) {
        await bot.telegram.sendChatAction(chatid, "upload_photo");
        await bot.telegram.sendPhoto(
          chatid,
          { source: readFileSync(photosPath + message.fileName) },
          { reply_markup: { inline_keyboard: message.inlineKeyboard } }
        );
        break;
        // just photo
      } else {
        await bot.telegram.sendChatAction(chatid, "upload_photo");
        await bot.telegram.sendPhoto(chatid, {
          source: readFileSync(photosPath + message.fileName),
        });
      }
  }
}
