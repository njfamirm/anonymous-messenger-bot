import { InlineKeyboardButton, InlineKeyboardMarkup } from "typegram";

// for all message type
export interface Message {
  type: "text" | "video" | "photo" | "music" | "voice" | "roundedVideo";
  text?: string;
  fileId?: string;
  delay?: number;
  caption?: string;
  inlineKeyboard?: Menu;
}

// user chat id
export type chatID = number | string;

// inlinekeyboard
export type Menu = InlineKeyboardButton[][];