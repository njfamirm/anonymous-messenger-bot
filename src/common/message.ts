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
  replyToUser,
  help,
  pleaseSendReply,
} from "../../data/json/message.json";

export const startMessage: Message = {
  text: start.text,
  inlineKeyboard: start.inlineKeyboard,
};

export const pleaseSendMessage: Message = {
  text: pleaseSend.text,
  inlineKeyboard: pleaseSend.inlineKeyboard,
};

export const pleaseSendReplyMessage: Message = {
  text: pleaseSendReply.text,
  inlineKeyboard: pleaseSendReply.inlineKeyboard,
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
  text: menu.text,
  inlineKeyboard: menu.inlineKeyboard,
};

export const helpMessage: Message = {
  text: help.text,
  inlineKeyboard: help.inlineKeyboard,
};

export const sendToAdminMenu: Menu = sendToAdmin.inlineKeyboard;
export const deleteMenu: Menu = deletemenu.inlineKeyboard;
export const sendedToChannelMenu: Menu = sendedToChannel.inlineKeyboard;
export const sendMenuMenu: Menu = sendMenu.inlineKeyboard;
export const replyUserMenu: Menu = replyToUser.inlineKeyboard;
export const replyMenu: Menu = replyToUser.inlineKeyboard;
