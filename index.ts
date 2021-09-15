import "./src/command/start";
import "./src/command/sendAnonymous";
import "./src/command/sendToChannel";
import "./src/command/sendMenu";
import bot from "./src/common/bot";
import "./src/db/config";
import "./src/command/delete";
import log from "./src/common/log";

log("start...");
bot.launch();
