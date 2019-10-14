const Log = require("../utils/log.js");

module.exports = class Team {
    constructor (config, client, logflag) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "team";
        this.description = `team command.`;
        this.help = `usage: team [name: string]...`;
        
        if (logflag) this.log.info(`${this.command} command loaded.`);
    }
    async exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let teams = [[], []];
        command.filter((w, i) => i).forEach(member => {
            let limit = (command.length - 1) / 2;
            let teamid = Math.floor(Math.random() * 2);
            if (teams[teamid].length >= limit) {
                teamid ^= 1;
            }
            teams[teamid].push(member);
        });
        
        let res = `blue: ${teams[0].join(" ")}\norange: ${teams[1].join(" ")}`;

        if (!command.pipe) {
            await message.channel.send(res);
            return null;
        }
        return res;
    }
};