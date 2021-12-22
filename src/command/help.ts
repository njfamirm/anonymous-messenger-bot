import { Context } from "telegraf";
import bot from "../common/bot";
import { help } from "../../data/json/message.json";
import { checkErrorCode } from "../common/checkError";

export async function SendHelp(ctx: Context) {
  ctx
    .reply(help, {
      reply_to_message_id: ctx.message?.message_id,
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });
}

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

bot.command("help", SendHelp);
// bot.action("help", EditHelp);
