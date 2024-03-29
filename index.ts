import "./src/command/start";
import "./src/command/sendAnonymous";
import "./src/command/sendToChannel";
import "./src/command/sendMenu";
import "./src/db/config";
import "./src/command/delete";
import "./src/command/help";
import "./src/command/reply";
import "./src/command/unClear";
import { logInfo } from "./src/common/log";
import bot from "./src/common/bot";

logInfo("Start...");
bot.launch();
