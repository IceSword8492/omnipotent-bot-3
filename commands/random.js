const Log = require("../utils/log.js");

module.exports = class RandomCommand {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = 'random';
        this.description = `random command.`;
        this.help = `usage: random`;

        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        let res = '';

        if (message.member.voiceChannelID) {
            const guildId = message.guild.id;
            const channelId = message.member.voiceChannelID;
            res = `https://discordapp.com/channels/${guildId}/${channelId}`;
        } else {
            res = 'failed';
        }

        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};
