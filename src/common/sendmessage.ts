import { readFileSync } from "fs";
import bot from "./bot";
import { photosPath } from "./data";
// import { messages } from "./db";
import { Message, chatID } from "./type";

// send message handler
export async function sendMessage(chatid: chatID, message: Message) {
  switch (message.type) {
    case "text":
      await sendText(chatid, message);
      break;

    // uploda photo
    case "photo":
      await sendPhoto(chatid, message);
      break;

    // upload voice
    case "document":
      await sendDocument(chatid, message);
      break;

    // upload voice or music
    case "voice":
      await sendVoice(chatid, message);
      break;

    // upload video
    case "video":
      await sendVideo(chatid, message);
      break;

    // rounded video...
    // ** TODO **//

    default:
      console.log("not supported!");
  }
}

// send text
async function sendText(chatid: chatID, message: Message) {
  if (message.text == undefined) return;
  // text message with inline keyboard
  if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "typing");
    await bot.telegram.sendMessage(chatid, message.text, {
      reply_markup: { inline_keyboard: message.inlineKeyboard },
    });
    // just text
  } else {
    await bot.telegram.sendChatAction(chatid, "typing");
    await bot.telegram.sendMessage(chatid, message.text);
  }
}

// send photo
async function sendPhoto(chatid: chatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

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

    // with text
  } else if (message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(
      chatid,
      { source: readFileSync(photosPath + message.fileName) },
      { caption: message.text }
    );

    // with inline keyboard
  } else if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(
      chatid,
      { source: readFileSync(photosPath + message.fileName) },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just photo
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(chatid, {
      source: readFileSync(photosPath + message.fileName),
    });
  }
}

// send document
async function sendDocument(chatid: chatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      {
        caption: message.text,
        reply_markup: { inline_keyboard: message.inlineKeyboard },
      }
    );

    // with text
  } else if (message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { caption: message.text }
    );

    // with inline keyboard
  } else if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just document
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(chatid, {
      source: readFileSync(photosPath + message.fileName),
      filename: message.fileName,
    });
  }
}

// send voice
async function sendVoice(chatid: chatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      {
        caption: message.text,
        reply_markup: { inline_keyboard: message.inlineKeyboard },
      }
    );

    // with text
  } else if (message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { caption: message.text }
    );

    // with inline keyboard
  } else if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just voice
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(chatid, {
      source: readFileSync(photosPath + message.fileName),
      filename: message.fileName,
    });
  }
}

// send video
async function sendVideo(chatid: chatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      {
        caption: message.text,
        reply_markup: { inline_keyboard: message.inlineKeyboard },
      }
    );

    // with text
  } else if (message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { caption: message.text }
    );

    // with inline keyboard
  } else if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(
      chatid,
      {
        source: readFileSync(photosPath + message.fileName),
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just video
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(chatid, {
      source: readFileSync(photosPath + message.fileName),
      filename: message.fileName,
    });
  }
}
