const Log = require("../utils/log.js");
const Markov = require("../markov/markov.js");

module.exports = class MarkovCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "markov";
        this.description = `markov command.`;
        this.help = `usage: markov <subcommand>
subcommands:
    create:
        usage: markov create [startword: string]
        description: create sentence (starts with startword if startword is defined).
    permission:
        usage: markov permission [permissionlevel: integer]
        description: set permission level for channels.
    limit:
        usage: markov limit [limit: integer]
        description: set limit for channels.`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }
        let res;

        if (command[1] === "create") {
            res = await Markov.exec(message, command[2] || undefined);
        } else if (command[1] === "permission") {
            if (command[2] && !isNaN(parseInt(command[2]))) {
                await Markov.update(message, undefined, parseInt(command[2]));
                res = `permission updated to "${parseInt(command[2])}"`;
            } else {
                res = `permission "${command[2]}" is malformed.`;
            }
        } else if (command[1] === "limit") {
            if (command[2] && !isNaN(parseInt(command[2]))) {
                await Markov.update(message, parseInt(command[2]));
                res = `permission updated to "${parseInt(command[2])}"`;
            } else {
                res = `permission "${command[2]}" is malformed.`;
            }
        } else {
            if (!command.pipe) {
                message.channel.send(`subcommand "${command[1]}" is undefined.`);
            }
            return `subcommand "${command[1]}" is undefined.`;
        }
        
        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};