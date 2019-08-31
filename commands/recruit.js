const Log = require("../utils/log.js");
const RecruitManager = require("../dbman/recruit.js");

module.exports = class Recruit {
    constructor (config, client, log) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "recruit";
        this.description = `recruit command.`;
        this.help = `usage: recruit <string> <limit: integer> [option]...
options:
    --tts, -t: tts flag
    --here, -h: here flag
    --rank, -r: rank flag`;
        
        this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let options = {
            tts: command.find(w => w === "--tts" || w === "-t"),
            here: command.find(w => w === "--here" || w === "-h"),
            rank: command.find(w => w === "--rank" || w === "-r")
        };
        let count = parseInt(command[2]);
        let res = "";

        if (typeof count === "number" && !isNaN(count)) {
            res = (options.here ? "@here" : "") +
            (options.rank ? "<@&495293852647817217>" : "") +
            "" + command[1] + "枠@" + count;
            if (!command.pipe) {
                let newMessage = await message.reply(res, {tts: options.tts});
                await RecruitManager.create(newMessage.id, count);
                await newMessage.react("⏏");
                await newMessage.react("✖");
            }
        } else {
            res = "failed";
            if (!command.pipe) {
                await message.reply(res);
            }
        }
        
        if (!command.pipe) {
            return null;
        }
        return res;
    }
};