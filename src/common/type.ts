import { InlineKeyboardButton } from "typegram";
import { DocumentRecord } from "@alimd/1db/src/index";

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
  inlineKeyboard?: Menu;
}

// user chat id
export type ChatID = number | string;

// inlinekeyboard
export type Menu = InlineKeyboardButton[][];