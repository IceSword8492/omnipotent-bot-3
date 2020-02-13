const dotenv = require("dotenv");
const fs = require("fs");
const discord = require("discord.js");
const Log = require("./utils/log.js");

const request = require("request-promise");

const ConnectionDataManager = require("./dbman/connectiondata.js");
const ConnectionTimeManager = require("./dbman/connectiontime.js");
const MarkovManager = require("./dbman/markov.js");
const MarkovCounterManager = require("./dbman/markovcounter.js");
const RecruitManager = require("./dbman/recruit.js");

const Markov = require("./markov/markov.js");

const DBBackup = require("./utils/dbbackup.js");

const Api = require("./api.js");

const ReactionManager = require("./reactionmanager.js");
const ConnectionTime = require("./connectiontime.js");

// import { fileURLToPath } from "url"
// import { dirname } from "path"

dotenv.config();

const config = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    CLIENT_ID: process.env.CLIENT_ID,
    // ROOT: dirname(fileURLToPath(import.meta.url)),
    ROOT: __dirname,
    PROD: process.env.PROD === "PROD"
};

const log = new Log();

let definedcommands = [];

const client = new discord.Client();

client.login(config.CLIENT_TOKEN);

client.on("ready", async () => {
    await DBBackup.initialize();
    if (config.PROD) {
        setInterval(_ => {
            DBBackup.backup();
        }, 60000);
    }

    await ConnectionDataManager.initialize(config);
    await ConnectionTimeManager.initialize(config);
    await MarkovManager.initialize(config);
    await MarkovCounterManager.initialize(config);
    await RecruitManager.initialize(config);

    await ReactionManager.registerEvents(client, config);
    await ConnectionTime.init(client);

    await Api.init(client);

    await fs.readdirSync("./commands", {withFileTypes: true}).forEach(async file => {if (!file.isDirectory()) await definedcommands.push(new (require(`./commands/${file.name}`))(config, client, true))});

    // try { setInterval(() => {request({url: "https://api.twitch.tv/kraken/streams/rainbow6jp?client_id=gmteu2zswb8px05m0lggbajsihqiey", method: "GET", json: true}).then(body => {if (body.stream){client.user.setActivity(/*live title*/ body.stream.channel.status, {type: "STREAMING",url: "https://twitch.tv/rainbow6jp"});}else{client.user.setActivity("", {});}});}, 60000); } catch {}
});

client.on("message", async message => {
    if (message.author.id === config.CLIENT_ID) {
        return;
    }
    let prev = "";
    let pattern = /```([^`\n]+\n)?(?<str>[\s\S]+)```|"(?<str2>([^\\"]|\\.)*)"|(?<str3>[^ |;]+)|(?<terminator>;)|(?<pipe>\|)/g;
    let matched = "";
    let commands = [[]];
    let executed = false;

    while (matched = pattern.exec(message.content)) {
        if (matched.groups.str || matched.groups.str2 || matched.groups.str3) {
            if (commands[commands.length - 1].pipe !== undefined) {
                commands.push([]);
            }
            commands[commands.length - 1].push(matched.groups.str || matched.groups.str2 || matched.groups.str3);
        }
        if (matched.groups.terminator) {
            commands[commands.length - 1].pipe = false;
        }
        if (matched.groups.pipe) {
            commands[commands.length - 1].pipe = true;
        }
    }
    for (let command of commands) {
        for (let defcmd of definedcommands) {
            if (defcmd.command === command[0]) {
                executed = true;
                prev = await defcmd.exec(message, command, prev);
            }
        }
    }
    if (!executed) {
        if (await Markov.update(message)) {
            await message.channel.send(await Markov.exec(message));
        }
        await Markov.register(message);
    }
});
