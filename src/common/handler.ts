import bot from "./bot";
import { Message, chatID } from "./type";

// send message handler
export async function sendMessage(chatid: chatID, message: Message) {
  switch (message.type) {
    case "text":
      // text message with inline keyboard
      if (message.text != undefined && message.inlineKeyboard != undefined) {
        await bot.telegram.sendChatAction(chatid, "typing");
        await bot.telegram.sendMessage(chatid, message.text, {
          reply_markup: {
            inline_keyboard: message.inlineKeyboard,
          },
        });
      }
  }
}
