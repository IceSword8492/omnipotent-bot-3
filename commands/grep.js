const Log = require("../utils/log.js");

module.exports = class GrepCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "grep";
        this.description = `grep command.`;
        this.help = `usage: grep <regex: string>`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let res = "```\n" + (prev.match(new RegExp(".*" + command[1] + ".*", "g")) || []).join("\n") + "```";

        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};