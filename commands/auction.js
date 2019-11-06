const Log = require("../utils/log.js");

module.exports = class AuctionCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "auction";
        this.description = `${this.command} command.`;
        this.help = `usage: ${this.command} [string]...`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let res = "https://skyblockauction.glitch.me/";
        
        if (!command.pipe) {
            await message.channel.send(res.substring(0, 1997) + "...");
            return null;
        }
        return res;
    }
};