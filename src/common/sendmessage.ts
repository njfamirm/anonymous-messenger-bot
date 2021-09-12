import { bot } from "./bot";
import { path } from "../../data/json/config.json";
import { Message, ChatID } from "./type";

// send message handler
export async function sendMessage(chatid: ChatID, message: Message) {
  switch (message.type) {
    case "text":
      await sendText(chatid, message);
      break;

    // uploda photo
    case "photo":
      await sendPhoto(chatid, message);
      break;

    // upload document
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

    // video note...
    // ** TODO **//

    default:
      console.log("not supported!");
  }
}

// send text
async function sendText(chatid: ChatID, message: Message) {
  if (message.text == undefined || message.text == "") return;
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
async function sendPhoto(chatid: ChatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(
      chatid,
      { source: path.photo + message.fileName },
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
      { source: path.photo + message.fileName },
      { caption: message.text }
    );

    // with inline keyboard
  } else if (message.inlineKeyboard != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(
      chatid,
      { source: path.photo + message.fileName },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just photo
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_photo");
    await bot.telegram.sendPhoto(chatid, {
      source: path.photo + message.fileName,
    });
  }
}

// send document
async function sendDocument(chatid: ChatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(
      chatid,
      {
        source: path.document + message.fileName,
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
        source: path.document + message.fileName,
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
        source: path.document + message.fileName,
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just document
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_document");
    await bot.telegram.sendDocument(chatid, {
      source: path.document + message.fileName,
      filename: message.fileName,
    });
  }
}

// send voice
async function sendVoice(chatid: ChatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(
      chatid,
      {
        source: path.voice + message.fileName,
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
        source: path.voice + message.fileName,
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
        source: path.voice + message.fileName,
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just voice
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_voice");
    await bot.telegram.sendAudio(chatid, {
      source: path.voice + message.fileName,
      filename: message.fileName,
    });
  }
}

// send video
async function sendVideo(chatid: ChatID, message: Message) {
  // if not have file, break func!
  if (message.fileName == undefined) return;

  // with inline keyboard & text
  if (message.inlineKeyboard != undefined && message.text != undefined) {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(
      chatid,
      {
        source: path.video + message.fileName,
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
        source: path.video + message.fileName,
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
        source: path.video + message.fileName,
        filename: message.fileName,
      },
      { reply_markup: { inline_keyboard: message.inlineKeyboard } }
    );

    // just video
  } else {
    await bot.telegram.sendChatAction(chatid, "upload_video");
    await bot.telegram.sendVideo(chatid, {
      source: path.video + message.fileName,
      filename: message.fileName,
    });
  }
}
