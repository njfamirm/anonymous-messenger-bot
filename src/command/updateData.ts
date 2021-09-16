// import bot from "../common/bot";
// import { channelID } from "../../data/json/config.json";
// import { Context } from "telegraf";
// import { configDB } from "../db/json/db";
// import { updated } from "../../data/json/message.json";

// async function getAdminList(ctx: Context) {
//   const botInfo = await bot.telegram.getMe();
//   const botChatID = botInfo.id;
//   const adminList = await bot.telegram.getChatAdministrators(channelID);
//   var adminChatIDList: Array<number> = [];
//   for (var admin of adminList) {
//     if (admin.user.id === botChatID) continue;
//     adminChatIDList.push(admin.user.id);
//   }
//   configDB.set("adminsChatIds", { adminChatIDList });
//   ctx.reply(updated);
// }

// bot.command("updatedata", getAdminList);
