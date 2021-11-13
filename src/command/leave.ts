import { Context } from "telegraf";
import { leaveMessage } from "../common/message";
import {logError} from "../common/log";
import { checkErrorCode } from "../common/checkError";

// for leave from wizard
export async function leaveEditMessage(ctx: Context) {
  if (
    !(
      leaveMessage.text != undefined && leaveMessage.inlineKeyboard != undefined
    )
  ) {
    logError("Error in leave from anonymous");
    return;
  }

  ctx
    .editMessageText(leaveMessage.text, {
      reply_markup: { inline_keyboard: leaveMessage.inlineKeyboard },
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });

  return (<any>ctx).scene.leave();
}

export async function leave(ctx: Context) {
  return (<any>ctx).scene.leave();
}
