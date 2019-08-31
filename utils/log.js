import dotenv from "dotenv"
import DateUtil from "./date.js"

dotenv.config();

export default class Log {
    constructor () {
        this.config = {
            output: {
                LEVEL: parseInt(process.env.LOG_LEVEL),
                const: {
                    INFO: 3,
                    WARN: 2,
                    ERROR: 1,
                    NONE: 0
                }
            }
        };
        this.date = new DateUtil();
    }
    info (message, /*optional*/ author) {
        if (this.config.output.LEVEL <= this.config.output.const.INFO) {
            console.info(`[${this.date.timeStr}] [${author || "Server"}/INFO]: ${message}`);
        }
        return `[${this.date.timeStr}] [${author || "Server"}/INFO]: ${message}`;
    }
    warn (message) {
        if (this.config.output.LEVEL <= this.config.output.const.WARN) {
            console.warn(`[${this.date.timeStr}] [${author || "Server"}/WARN]: ${message}`);
        }
        return `[${this.date.timeStr}] [${author || "Server"}/WARN]: ${message}`;
    }
    error (message) {
        if (this.config.output.LEVEL <= this.config.output.const.ERROR) {
            console.error(`[${this.date.timeStr}] [${author || "Server"}/ERROR]: ${message}`);
        }
        return `[${this.date.timeStr}] [${author || "Server"}/ERROR]: ${message}`;
    }
};