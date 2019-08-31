const DBMan = require("../utils/dbman.js"
);

module.exports = class ConnectionTimeManager extends DBMan {
    static tablename = "connectionTime";
    static columns = {userid: this.types.text, date: this.types.text, time: this.types.integer};

    static async create (userid, date, time) {
        this._insert({userid, date, time});
    }

    static async update (userid, date, time) {
        await this._update({time}, {userid: `= '${userid}'`, date: `= '${date}'`});
    }
};