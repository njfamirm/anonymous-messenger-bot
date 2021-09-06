import { Menu } from "./type";

export const mainMenu: Menu = [
  [
    {
      text: "send anonymous",
      callback_data: "anonymous",
    },
  ],
];

export const sendedMenu: Menu = [[{ text: "delete", callback_data: "delete" }, {text:"menu", callback_data:"sendMenu"}]];

export const deleteMenu: Menu = [[{ text: "delete", callback_data: "delete" }]];

export const sendToAdminMenu: Menu = [
  [
    { text: "delete", callback_data: "delete" },
    { text: "reply", callback_data: "replyToUser" },
    { text: "send to channel", callback_data: "sendToChannel" },
  ],
];

export const leaveMenu: Menu = [[{text:"leave", callback_data:"leave"}]]

export const backToMainMenu: Menu = [[{ text: "back to menu", callback_data: "menu" }]];

