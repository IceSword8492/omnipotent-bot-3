const Log = require("../utils/log.js");
const fs = require("fs");

module.exports = class EchoCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "help";
        this.description = `help command.`;
        this.help = `usage: help [command: string]`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let res = {
            embed: {
                color: 0xff0000,
                fields: [
                    {
                        name: "unknown",
                        value: "requested command is unknown"
                    }
                ]
            }
        };;
        let fileList = fs.readdirSync(this.config.ROOT + "/commands");
        let commands = fileList.map(file => new (require("./" + file))(this.config, this.client, false));
        if (command[1]) {
            commands.forEach(cmd => {
                if (cmd.command === command[1]) {
                    res = {
                        embed: {
                            color: 0xff0000,
                            fields: [
                                {
                                    name: cmd.command,
                                    value: cmd.description + "\n" + cmd.help
                                }
                            ]
                        }
                    };
                }
            });
        } else {
            res = {
                embed: {
                    color: 0xff0000,
                    fields: commands.map(command => ({
                        name: command.command,
                        value: command.description
                    }))
                }
            };
        }
        
        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};