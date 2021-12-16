// import { Context } from "telegraf";
// import bot from "../common/bot";
// import { helpMessage } from "../common/message";
// import { checkErrorCode } from "../common/checkError";

// export async function SendHelp(ctx: Context) {
//   if (
//     helpMessage.text === undefined ||
//     helpMessage.inlineKeyboard === undefined ||
//     ctx.message === undefined
//   )
//     return;
//   ctx
//     .reply(helpMessage.text, {
//       reply_markup: { inline_keyboard: helpMessage.inlineKeyboard },
//       reply_to_message_id: ctx.message?.message_id,
//     })
//     .catch((err) => {
//       checkErrorCode(ctx, err, false);
//     });
// }

// async function EditHelp(ctx: Context) {
//   if (
//     helpMessage.text === undefined ||
//     helpMessage.inlineKeyboard === undefined
//   )
//     return;
//   ctx
//     .editMessageText(helpMessage.text, {
//       reply_markup: { inline_keyboard: helpMessage.inlineKeyboard },
//     })
//     .catch((err) => {
//       checkErrorCode(ctx, err, false);
//     });
// }

// bot.command("help", SendHelp);
// bot.action("help", EditHelp);
