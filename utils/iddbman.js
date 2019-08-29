import DBMan from "./dbman.js"

export default class IdDBMan extends DBMan {
    static async initialize (config) {
        this.config = config;

        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(this.log.error);
        await db.run(`create table ${this.tablename} (id integer unique not null primary key autoincrement, ${Object.entries(this.columns).map(column => `${column[0]} ${column[1]}`).join(", ")})`)
            .then(_ => this.log.info(`table (${this.tablename}) was created`))
            .catch(_ => this.log.info(`table (${this.tablename}) already exists`));
    }

    static async _insert (data) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(this.log.error);
        await db.run(`insert into ${this.tablename} (${Object.entries(data).map(column => column[0]).join(", ")}) values (${Object.entries(data).map(column => typeof column[1] === "string" ? `'${column[1]}'` : column[1]).join(", ")})`).catch(this.log.error);
        let res = await db.get(`select max(id) from ${this.tablename}`);
        return res["max(id)"];
    }
};