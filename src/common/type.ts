import { InlineKeyboardButton, InlineKeyboardMarkup } from "typegram";
import { DocumentRecord } from "../db/1db";

// for all message type
export interface Message {
  type?:
    | "text"
    | "video"
    | "photo"
    | "voice"
    | "videoNote"
    | "document"
    | "mediaGroup";

  text?: string;
  fileName?: string;
  inlineKeyboard?: InlineKeyboardButton[][];
}

// user chat id | username
export type ChatID = number | string;

// inlinekeyboard
export type Menu = InlineKeyboardButton[][];

// message ids
export interface messageSendedId extends DocumentRecord {
  replyMessageId: number;
  admin: Array<Array<number>>;
  userChatId: number;
}
