import { Message } from "./type";
import { leaveMenu, sendedMenu, backToMainMenu, mainMenu } from "./Menu";

// please send message
export const pleaseSend: Message = {
  text: "please send me...",
  inlineKeyboard: leaveMenu,
};

// ok mwssage when sended to admin
export const sended: Message = {
  text: "sended",
  inlineKeyboard: sendedMenu,
};

export const leaveMessage: Message = {
  text: "leaved!",
  inlineKeyboard: backToMainMenu,
};

export const startMessage: Message = {
  type: "text",
  text: "Hello World!",
  inlineKeyboard: mainMenu,
};

export const mainMenuMessage: Message = {
    type: "text",
    text: "Hello World!",
    inlineKeyboard: mainMenu,
  };