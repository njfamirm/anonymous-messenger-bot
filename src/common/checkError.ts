import { Context } from "telegraf";
import { forbiddenErrorMessage } from "../../data/json/message.json";
import log from "./log";
import { leave } from "../command/leave";

// check error => if 403 forbiden
// send forbiden message
// and leave from wizard
// else => log error
export function checkErrorCode(ctx: Context | null, err: any, reply: boolean) {
  // 403 forbiden error
  if (err.response.error_code === 403 && ctx === null) {
    return;
  } else if (err.response.error_code === 403) {
    if (reply) {
      (<any>ctx).reply(forbiddenErrorMessage);
    }
    leave(<any>ctx);

    // other error
  } else {
    log(err);
  }
}
