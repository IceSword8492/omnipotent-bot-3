const Log = require("../utils/log.js");

module.exports = class JudgeCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "judge";
        this.description = `judge command.`;
        this.help = `usage: judge [accused: mention]`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let res = "";

        switch (new Date().getTime() % 3) {
        case 0:
            res = "guilty";
            break;
        case 1:
            res = "not guilty";
            break;
        case 2:
            res = "innocent";
            break;
        default:
            res = "error";
            break;
        }

        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};