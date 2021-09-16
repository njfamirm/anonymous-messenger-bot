import { OneDB } from "../../1db/1db";

// add user json file
const userDBPath = "./data/json/user.json";
export const userDB = new OneDB(userDBPath);

// conig json file
// const configDBPath = "./data/json/config.json";
// export const configDB = new OneDB(configDBPath);
