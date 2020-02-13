const Log = require("../utils/log.js");

module.exports = class HypixelKeyCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "hypixel-key";
        this.description = `hypixel-key command.`;
        this.help = `usage: hypixel-key`;

        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (!command.pipe) {
            await message.channel.send(this.client.config['HYPIXEL_KEY'] || 'undefined');
            return null;
        }
        return res;
    }
};
