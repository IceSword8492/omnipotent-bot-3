import Log from "../utils/log.js";

export default class Echo {
    constructor (config, client, log) {
        this.config = config;
        this.client = client;
        this.log = new Log();

        this.command = "echo";
        
        this.log.info("echo command loaded.");
    }
    exec (message, command, prev) {
        if (prev) {
            command = [null, ...prev.split(/ |,/g)];
        }

        let res = command.filter((w, i) => i).join(" ");
        
        if (!command.pipe) {
            message.channel.send(res);
            return null;
        }
        return res;
    }
};