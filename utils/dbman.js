const sqlite = require("sqlite-async");
const Log = require("./log.js");

module.exports = class DBMan {
    static types = {
        null: "null",           // NULL値
        integer: "integer",     // 符号付整数
        real: "real",           // 浮動小数点数
        text: "text",           // テキスト
        blob: "blob"            // Binary Large Object
    };
    static config;
    static sqlite = sqlite;
    static log = new Log();

    /**
     * @virtual
     * @field
     * @type {string}
     * @example "table_test"
     */
    static tablename;

    /**
     * @virtual
     * @field
     * @type {columns}
     * @example {column_test: this.types.text}
     */
    static columns;
    
    static async initialize (config) {
        this.config = config;

        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        await db.run(`create table ${this.tablename} (${Object.entries(this.columns).map(column => `${column[0]} ${column[1]}`).join(", ")})`)
            .then(_ => this.log.info(`table (${this.tablename}) was created.`))
            .catch(_ => this.log.info(`table (${this.tablename}) already exists.`));
    }

    static async _insert (data) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        await db.run(`insert into ${this.tablename} (${Object.entries(data).map(column => column[0]).join(", ")}) values (${Object.entries(data).map(column => typeof column[1] === "string" ? `'${column[1]}'` : column[1]).join(", ")})`).catch(_ => {});
    }

    static async _update (data, where) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        await db.run(`update ${this.tablename} set ${Object.entries(data).map(column => `${column[0]} = ${typeof column[1] === "string" ? `'${column[1]}'` : column[1]}`).join(", ")} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`).catch(_ => {});
    }
    
    static async _delete (where) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        await db.run(`delete from ${this.tablename} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`).catch(_ => {});
    }

    static async exists (where) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        let res = await db.get(`select * from ${this.tablename} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`);
        return !!res;
    }
    
    static async getData (columns, where) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        return await db.get(`select ${columns.split(/[ \t\v\f]/g).join(", ")} from ${this.tablename} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`);
    }

    static async getList (columns, where = [], count = -1, offset = 0, order = "") {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        return await db.all(`select ${columns.split(/[ \t\v\f]/g).join(", ")} from ${this.tablename} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`);
    }

    static async count (where) {
        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(_ => {});
        let res = await db.get(`select count(*) from ${this.tablename} where ${Object.entries(where).map(cond => `${cond[0]} ${cond[1]}`).join(" and ")}`);
        return res["count(*)"];
    }
};