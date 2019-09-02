const Log = require("../utils/log.js");

module.exports = class EchoCommand {
    constructor (config, client, log) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "help";
        this.description = `help command.`;
        this.help = `usage: help [command: string]`;
        
        this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let res = command.filter((w, i) => i).join(" ");
        
        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};