const Log = require("../utils/log.js");
const Markov = require("../markov/markov.js");

module.exports = class EchoCommand {
    constructor (config, client, log) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "tnp";
        this.description = `tnp command.`;
        this.help = `usage: tnp`;
        
        this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let res = await Markov.exec(message, command[2] || undefined);
        
        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};