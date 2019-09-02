const Log = require("../utils/log.js");
const TinySegmenter = require("../utils/tinysegmenter.js");
const MarkovManager = require("../dbman/markov.js");
const MarkovCounterManager = require("../dbman/markovcounter.js");

const log = new Log();

module.exports = class Markov {
    static async update (message, newlimit, newpermission) {
        await MarkovCounterManager.create(message);

        let res = false;
        let {messageCount, messageLimit, permission} = await MarkovCounterManager.getData("messageCount messageLimit permission", {channelId: `= '${message.channel.id}'`});
        if (++messageCount >= messageLimit) {
            messageCount = 0;
            res = true;
        }
        await MarkovCounterManager.update(message.channel.id, messageCount, messageLimit = newlimit !== undefined ? newlimit : messageLimit, permission = newpermission !== undefined ? newpermission : permission);
        return res && permission;
    }
    static async exec (message, startword) {
        let markov = new Markov();
        let segmenter = new TinySegmenter();
        let records = await MarkovManager.getList("message", {channelId: `= '${message.channel.id}'`});
        let {messageCount, messageLimit, permission} = await MarkovCounterManager.getData("messageCount messageLimit permission", {channelId: `= '${message.channel.id}'`});
        let lines = records.map(record => record.message).join("\n").split("\n");

        lines.forEach(async line => {
            line = line.replace(/<(:|@|#)[^>]+>/g, "")
                .replace(/http(s)?:\/\/[^ ]+/g, "");
            let tokens = segmenter.segment(line);
            await markov.add(tokens);
        });
        if (startword) {
            startword = segmenter.segment(startword)[0];
        }
        return await markov.create(startword);
    }
    static async register (message) {
        await MarkovManager.create(message);
    }

    words = [];
    async add (tokens) {
        for (let i = 0; i < tokens.length; i++) {
            this.words.push([
                i > 1 ? tokens[i - 2] : null,
                i > 0 ? tokens[i - 1] : null,
                tokens[i],
                i < (tokens.length - 2) ? tokens[i + 1] : null,
                i < (tokens.length - 1) ? tokens[i + 2] : null
            ]);
        }
    }
    async create (startword) {
        let start = [];
        for (let i of this.words) {
            if (i[0] === null && i[1] === null && !startword) {
                start.push(i);
            }
            if (startword && i[2] === startword) {
                start.push(i);
            }
        }
        let sentencearray = [start[Math.floor(start.length * Math.random())]];
        if (sentencearray.length === 0 || sentencearray === undefined) {
            return log.error("unexpected error has been occurred.", "markov::Markov#create");
        }
        while (sentencearray[sentencearray.length - 1][3]) {
            let next = [];
            for (let i of this.words) {
                if (i[0] === sentencearray[sentencearray.length - 1][1] && i[1] === sentencearray[sentencearray.length - 1][2]) {
                    next.push(i);
                }
            }
            sentencearray.push(next[Math.floor(Math.random() * next.length)]);
        }
        if (!sentencearray[sentencearray.length - 1][3] && !sentencearray[sentencearray.length - 1][4]) {
            try {
                sentencearray[sentencearray.length - 1] = [null, null, sentencearray[sentencearray.length - 2][3], null, null];
                sentencearray.push([null, null, sentencearray[sentencearray.length - 2][4], null, null]);
            } catch {}
        }
        let sentence = sentencearray.map(word => word[2]).join("");
        let signs = [];
        for (let i = 0; i < sentence.length - 1; i++) {
            switch (sentence.substring(i, i + 1))
            {
            case "(":
                signs.push(")");
                break;
            case "[":
                signs.push("]");
                break;
            case "「":
                signs.push("」");
                break;
            case "{":
                signs.push("}");
                break;
            case ")":
                sentence = sentence.replace(")", "");
                break;
            case "]":
                sentence = sentence.replace("]", "");
                break;
            case "」":
                sentence = sentence.replace("」", "");
                break;
            case "}":
                sentence = sentence.replace("}", "");
                break;
            }
        }
        signs.reverse();
        return sentence + signes.join("");
    }
}