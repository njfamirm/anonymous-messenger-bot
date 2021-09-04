import { OneDB } from "@alimd/1db/src/index";
import { jsonPath } from "./data";
import { MessageListItem } from "./type";

export const messages = new OneDB(`${jsonPath}message.json`);

console.log(messages.get<MessageListItem>("start"));
