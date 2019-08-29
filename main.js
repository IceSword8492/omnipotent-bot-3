import dotenv from "dotenv"
import fs from "fs"
import discord from "discord.js"
import Log from "./utils/log.js"

import ConnectionDataManager from "./dbman/connectiondata.js"
import ConnectionTimeManager from "./dbman/connectiontime.js"
import MarkovManager from "./dbman/markov.js";
import MarkovCounterManager from "./dbman/markovcounter.js"
import RecruitManager from "./dbman/recruit.js"

import { fileURLToPath } from "url"
import { dirname } from "path"

dotenv.config();

const config = {
    CLIENT_TOKEN: process.env.CLIENT_TOKEN,
    ROOT: dirname(fileURLToPath(import.meta.url))
};

const log = new Log();

let definedcommands = [];

const client = new discord.Client();

client.login(config.CLIENT_TOKEN);

client.on("ready", async () => {
    await ConnectionDataManager.initialize(config);
    await ConnectionTimeManager.initialize(config);
    await MarkovManager.initialize(config);
    await MarkovCounterManager.initialize(config);
    await RecruitManager.initialize(config);

    await fs.readdirSync("./commands", {withFileTypes: true}).forEach(async file => {if (!file.isDirectory()) await definedcommands.push(new (await import(`./commands/${file.name}`)).default(config, client))});
});

client.on("message", async message => {
    let prev = "";
    let pattern = /```(?<str>[\s\S]+)```|"(?<str2>([^\\"]|\\.)*)"|(?<str3>[^ |;]+)|(?<terminator>;)|(?<pipe>\|)/g;
    let matched = "";
    let commands = [[]];
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
    commands.forEach(command => {
        definedcommands.forEach(defcmd => {
            if (defcmd.command === command[0]) {
                prev = defcmd.exec(message, command, prev);
            }
        });
    });
});