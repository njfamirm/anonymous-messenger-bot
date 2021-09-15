import { QueryConfig } from "pg";
import { saveMessageIdsQuery } from "../../data/json/databaseQuery.json";
import log from "../common/log";
import { messageIds } from "../common/type";
import { pool } from "./config";

// save message ids and chat ids in db
export async function saveMessageIdsDB(messageIds: messageIds) {
  const saveMessageIds: QueryConfig = {
    text: saveMessageIdsQuery,
    values: [
      messageIds.userChatId,
      messageIds.mainMessageId,
      messageIds.replyMessageId,
      messageIds.adminChatIds,
      messageIds.adminMessageIds,
    ],
  };

  await pool.query(saveMessageIds).catch((err) => {
    log(err);
  });
}
