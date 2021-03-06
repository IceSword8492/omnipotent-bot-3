const Log = require("../utils/log.js");

module.exports = class EchoCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "echo";
        this.description = `echo command.`;
        this.help = `usage: echo [string]...`;

        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let res = "";

        if (prev) {
            res = prev;
        } else {
            res = command.filter((w, i) => i).join(" ");
        }

        if (!command.pipe) {
            await message.channel.send(res.substring(0, 1997) + "...");
            return null;
        }
        return res;
    }
};
