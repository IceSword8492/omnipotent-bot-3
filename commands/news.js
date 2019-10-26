const Log = require("../utils/log.js");
const request = require("request-promise");
const dotenv = require("dotenv");

dotenv.config();

module.exports = class NewsCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "news";
        this.description = `news command.`;
        this.help = `usage: news`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let res = await request("https://api.hypixel.net/skyblock/news?key=" + process.env.HYPIXEL_KEY);
        
        if (!command.pipe) {
            await message.channel.send({
                "embed": {
                        "title": "**Hypixel Skyblock News**",
                        "url": "https://hypixel.net/",
                        "color": 16777215,
                        "footer": {
                        "icon_url": "https://hypixel.net/media/hypixel-logo-spinning.14297/full?d=1542422382",
                        "text": "hypixel"
                    },
                    "thumbnail": {
                        "url": "https://hypixel.net/media/hypixel-logo-spinning.14297/full?d=1542422382"
                    },
                    "author": {
                        "name": "Hypixel Skyblock",
                        "url": "https://hypixel.net/",
                        "icon_url": "https://hypixel.net/media/hypixel-logo-spinning.14297/full?d=1542422382"
                    },
                    "fields": JSON.parse(res).items.map(item => ({
                        "name": "**" + item.title + "**",
                        "value": item.text + "\n" + "[read more...](" + item.link + ")",
                    }))
                }
            });
            return null;
        }
        return JSON.stringify(JSON.parse(res), 0, 2);
    }
};