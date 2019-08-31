const DBMan = require("../utils/dbman.js");

module.exports = class MarkovManager extends DBMan {
    static tablename = "markov";
    static columns = {channelId: this.types.text, message: this.types.text, date: this.types.text};

    static async create (message) {
        this._insert({channelId: message.channel.id, message: message.content, date: new Date().getTime()});
    }
};