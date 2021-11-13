import { ILogObject, Logger } from "tslog";
import { appendFileSync } from "fs";


const log : Logger = new Logger({name: "error"})

log.attachTransport({
    info: writeInfoLog,
    error: writeErrorLog,

    silly: logToTransport,
    debug: logToTransport,
    trace: logToTransport,
    warn: logToTransport,
    fatal: logToTransport,
}, "debug")

export function logError(msg: string) {
  log.error(msg)
}

export function logInfo(msg: string) {
  log.info(msg)
}

function writeErrorLog(logObject: ILogObject) {
  appendFileSync("./error.log", `[ ${logObject.date.toLocaleTimeString()} - ${logObject.date.toDateString()} ]\t ${logObject.fullFilePath} →${logObject.argumentsArray}\n`);
}


function writeInfoLog(logObject: ILogObject) {
  appendFileSync("./info.log", `[ ${logObject.date.toLocaleTimeString()} - ${logObject.date.toDateString()} ]\t ${logObject.argumentsArray}\n`);
}

function logToTransport(logObject: ILogObject) {
}