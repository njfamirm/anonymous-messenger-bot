import { Menu } from "./type";

export const startMenu: Menu = [
  [
    {
      text: "send anonymous",
      callback_data: "anonymous",
    },
  ],
];

export const sendedMenu: Menu = [[{ text: "delete", callback_data: "delete" }]];

export const sendToAdminMenu: Menu = [
  [
    { text: "delete", callback_data: "delete" },
    { text: "reply", callback_data: "replyToUser" },
    { text: "send to channel", callback_data: "sendToChannel" },
  ],
];

export const mainMenu: Menu = [
  [
    {
      text: "send anonymous",
      callback_data: "anonymous",
    },
  ],
];
