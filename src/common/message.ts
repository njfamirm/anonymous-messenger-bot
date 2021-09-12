import { Message, Menu } from "./type";
import {
  start,
  sendMenu,
  pleaseSend,
  sended,
  leave,
  menu,
  sendToAdmin,
  deletemenu,
  sendedToChannel,
} from "../../data/json/message.json";

export const startMessage: Message = {
  type: "text",
  text: start.text,
  inlineKeyboard: start.inlineKeyboard,
};

export const pleaseSendMessage: Message = {
  text: pleaseSend.text,
  inlineKeyboard: pleaseSend.inlineKeyboard,
};

export const sendedMessage: Message = {
  text: sended.text,
  inlineKeyboard: sended.inlineKeyboard,
};

export const leaveMessage: Message = {
  text: leave.text,
  inlineKeyboard: leave.inlineKeyboard,
};

export const mainMenuMessage: Message = {
  type: "text",
  text: menu.text,
  inlineKeyboard: menu.inlineKeyboard,
};

export const sendToAdminMenu: Menu = sendToAdmin.inlineKeyboard;
export const deleteMenu: Menu = deletemenu.inlineKeyboard;
export const sendedToChannelMenu: Menu = sendedToChannel.inlineKeyboard;
export const sendMenuMenu: Menu = sendMenu.inlineKeyboard;
