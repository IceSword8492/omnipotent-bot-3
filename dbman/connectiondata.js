import DBMan from "../utils/dbman.js"

export default class ConnectionDataManager extends DBMan {
    static tablename = "connectionData";
    static columns = {id: this.types.text, nickname: this.types.text, backgroundColor: this.types.text, borderColor: this.types.text};

    static async initialize (config) {
        this.config = config;

        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(this.log.error);
        await db.run(`create table ${this.tablename} (${Object.entries(this.columns).map((column, index) => index ? `${column[0]} ${column[1]}` : `${column[0]} ${column[1]} unique`).join(", ")})`)
            .then(_ => this.log.info(`table (${this.tablename}) was created.`))
            .catch(_ => this.log.info(`table (${this.tablename}) already exists.`));
    }

    static async create (id, nickname, backgroundColor, borderColor) {
        this._insert({id, nickname, backgroundColor, borderColor});
    }

    static async update (nickname, id) {
        this._update({nickname}, {id: "= '${id}'"});
    }
};