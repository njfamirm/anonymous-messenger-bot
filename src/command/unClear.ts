import { Context } from "telegraf";
import bot from "../common/bot";
import { helpMessage } from "../common/message";
import { checkErrorCode } from "../common/checkError";
import {unclear} from "../../data/json/message.json"

export async function SendUnclear(ctx: Context) {
  if (
    helpMessage.text === undefined ||
    ctx.message === undefined
  )
    return;
  ctx
    .reply(unclear , {
      reply_to_message_id: ctx.message?.message_id,
    })
    .catch((err) => {
      checkErrorCode(ctx, err, false);
    });
}

const regex = new RegExp(/(.+)/)
bot.hears(regex, SendUnclear)