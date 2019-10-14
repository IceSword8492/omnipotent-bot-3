const Log = require("./utils/log.js");
const ConnectionTimeManager = require("./dbman/connectiontime.js");
const ConnectionDataManager = require("./dbman/connectiondata.js");

module.exports = class ConnectionTime {
    static gulid = null;
    static log = new Log();

    static async init (client) {
        this.guild = client.guilds.get("309556801400209408");
        if (!this.guild) {
            this.log.error("guild not found.");
            throw new Error();
        }
        setInterval(async _ => {
            let connectedMembers = this.guild.members.filter(member => !!member.voiceChannelID);
            connectedMembers.forEach(async member => {
                let date = this.getDate();
                let record = await ConnectionTimeManager.getData("*", {userid: `= '${member.id}'`, date: `= ${date}`});
                if (!record) {
                    await ConnectionTimeManager.create(member.id, date, 1);
                }
                console.log(member.id, member.user.username, member.nickname);
                await ConnectionTimeManager.update(member.id, date, record ? record.time + 1 : 1); // todo ニックネーム更新
                await ConnectionDataManager.update(member.nickname || member.user.username, member.id);
            });
        }, 60000);
    }
    static getDate ()
    {
        return ("" + new Date().getFullYear()).padStart(4, "0") + ("" + (new Date().getMonth() + 1)).padStart(2, "0") + ("" + new Date().getDate()).padStart(2, "0");
    }
};