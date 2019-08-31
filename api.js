const express = require("express"
);
const ConnectionTimeManager = require("./dbman/connectiontime.js"
);
const ConnectionDataManager = require("./dbman/connectiondata.js"
);

module.exports = class Api {
    static async init (client) {
        let app = express();
        let listener = app.listen(process.env.PORT || 8080, _ => {});
        app.get("/", async (req, res) => {
            res.status(200).send();
        });
        app.get("/api/v1/connection", async (req, res) => {
            let records = await ConnectionTimeManager.getList("*", {userid: ""}).catch(_ => null);
            let responseObject = {};
            for (let record of records) {
                if (!responseObject[record.userid]) {
                    responseObject[record.userid] = {};
                }
                responseObject[record.userid][record.date] = record.time;
            }
            let responseArray = [];
            Object.entries(responseObject).forEach(entry => {
                if (!responseArray.find(element => element.id === entry[0])) {
                    responseArray.push({
                        id: entry[0],
                        connectionTime: []
                    });
                }
                responseArray.forEach(async element => {
                    let member = client.guilds.get("309556801400209408").members.find(member => member.id === element.id);
                    let rdmint255 = _ => Math.floor(Math.random() * 256);
                    let rdmclr = _ => [rdmint255(), rdmint255(), rdmint255()];
                    let [r, g, b] = rdmclr();
                    let makeColorString = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
                    await ConnectionDataManager.create(element.id, member.nickname ? member.nickname : member.user.username, makeColorString(r, g, b, .5), makeColorString(r, g, b, 1)).then(async _ => await ConnectionDataManager.update(member.nickname ? member.nickname : member.user.username, element.id).catch(_ => null)).catch(_ => null);
                });
                responseArray.forEach(element => {
                    if (element.id === entry[0]) {
                        element.connectionTime.push(entry[1]);
                    }
                });
            });
            responseArray.forEach(entry => {
                entry.connectionTime = entry.connectionTime.reduce((o, c) => ({
                    ...o,
                    [Object.keys(c)[0]]: c
                }));
            }, {});
            responseArray = await (async _ => Promise.all(responseArray.map(async entry => {
                let memberData = await ConnectionDataManager.getData("*", {id: `= '${entry.id}'`});
                entry.nickname = memberData.nickname;
                entry.backgroundColor = memberData.backgroundColor;
                entry.borderColor = memberData.borderColor;
                return entry;
            })))();
            res.send(req.query.format === "js" ? "let data = " + JSON.stringify(responseArray) + ";" : JSON.stringify(responseArray));
        });
    }
}