import bot from "./src/common/bot";
import "./src/command/start";
import "./src/command/sendAnonymous";
import "./src/command/sendToChannel"
import "./src/command/sendMenu"

console.log("start...");
bot.launch();
