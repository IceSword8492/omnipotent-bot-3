const DBMan = require("../utils/dbman.js"
);

module.exports = class ConnectionDataManager extends DBMan {
    static tablename = "connectionData";
    static columns = {id: this.types.text, nickname: this.types.text, backgroundColor: this.types.text, borderColor: this.types.text};

    static async initialize (config) {
        this.config = config;

        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(this.log.error);
        await db.run(`create table if not exists ${this.tablename} (${Object.entries(this.columns).map((column, index) => index ? `${column[0]} ${column[1]}` : `${column[0]} ${column[1]} unique`).join(", ")})`)
            .catch(this.log.error);
    }

    static async create (id, nickname, backgroundColor, borderColor) {
        this._insert({id, nickname, backgroundColor, borderColor});
    }

    static async update (nickname, id) {
        this._update({nickname}, {id: "= '${id}'"});
    }
};