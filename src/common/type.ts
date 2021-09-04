import { InlineKeyboardButton, InlineKeyboardMarkup } from "typegram";
import { DocumentRecord } from "@alimd/1db/src/index";

// for all message type
export interface Message {
  type: "text" | "video" | "photo" | "voice" | "roundedVideo" | "document";
  text?: string;
  fileName?: string;
  inlineKeyboard?: Menu;
}

// user chat id
export type chatID = number | string;

// inlinekeyboard
export type Menu = InlineKeyboardButton[][];

export interface MessageListItem extends DocumentRecord {
  messageList: Array<Message>;
}