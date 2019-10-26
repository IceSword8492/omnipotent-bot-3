const Log = require("../utils/log.js");

module.exports = class EmbedCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "embed";
        this.description = `${this.command} command.`;
        this.help = `usage: ${this.command} [options: option]...`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let eraseFlag = false;
        let res = {
            "content": "",
            "embed": {},
        };

        for (let i in command) {
            let option = command[i];
            let value = command[parseInt(i) + 1];
            if (option === "--erase" || option === "-e" || option === "--delete" || option === "-del") {
                eraseFlag = true;
                continue;
            }
            if (option === "--option" || option === "-o") {
                res = JSON.parse(value);
                continue;
            }
            if (option === "--title" || option === "-t") {
                res.embed.title = value;
                continue;
            }
            if (option === "--description" || option === "-d") {
                res.embed.description = value;
                continue;
            }
            if (option === "--url" || option === "-u") {
                res.embed.url = value;
                continue;
            }
            if (option === "--color" || option === "-c") {
                res.embed.color = parseInt(value);
                continue;
            }
            if (option === "--timestamp" || option === "-ts") {
                res.embed.timestamp = value;
                continue;
            }
            if (option === "--footer" || option === "-f") {
                res.embed.footer = {};
                res.embed.footer.icon_url = command[parseInt(i) + 1];
                res.embed.footer.text = command[parseInt(i) + 2];
                continue;
            } // TODO 全機能実装
        }



        if (!command.pipe) {
            await message.channel.send(res);
            if (eraseFlag) {
                message.delete();
            }
            return null;
        }
        return res;
    }
};