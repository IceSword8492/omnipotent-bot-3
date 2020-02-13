const IdDBMan = require("../utils/iddbman.js");

module.exports = class ChangelogManager extends IdDBMan {
    static tablename = "changelog";
    static columns = {title: this.types.text, timestamp: this.types.integer};

    static async create (title) {
        const timestamp = new Date().getTime();
        await this._insert({title, timestamp});
    }
};
