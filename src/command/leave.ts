import { Context } from "telegraf";
import { leaveMessage } from "../common/message";
import log from "../common/log";

// for leave from wizard
export async function leaveEditMessage(ctx: Context) {
  if (
    !(
      leaveMessage.text != undefined && leaveMessage.inlineKeyboard != undefined
    )
  ) {
    log("Error in leave from anonymous");
    return;
  }

  ctx.editMessageText(leaveMessage.text, {
    reply_markup: { inline_keyboard: leaveMessage.inlineKeyboard },
  });

  return (<any>ctx).scene.leave();
}

export async function leave(ctx: Context) {
  return (<any>ctx).scene.leave();
}
