import "./src/command/start";
import "./src/command/sendAnonymous";
import "./src/command/sendToChannel";
import "./src/command/sendMenu";
import { bot } from "./src/common/bot";

console.log("start...");
bot.launch();
