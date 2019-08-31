import DBMan from "../utils/dbman.js"

export default class MarkovManager extends DBMan {
    static tablename = "markovCounter";

    static async initialize (config) {
        this.config = config;

        let db = await this.sqlite.open(this.config.ROOT + "/database/main.db").catch(this.log.error);
        await db.run(`create table ${this.tablename} (channelId text unique not null, ${Object.entries(this.columns).filter((c, i) => !!i).map(column => `${column[0]} ${column[1]}`).join(", ")})`)
            .then(_ => this.log.info(`table (${this.tablename}) was created.`))
            .catch(_ => this.log.info(`table (${this.tablename}) already exists.`));
    }

    static columns = {channelId: this.types.text, messageCount: this.types.integer, messageLimit: this.types.integer, permission: this.types.integer};

    static async create (message) {
        await this._insert({channelId: message.channel.id, messageCount: 0, messageLimit: 5, permission: 0});
    }

    static async update (channelId, messageCount, messageLimit, permission) {
        await this._update({channelId, messageCount, messageLimit, permission}, {channelId: `= '${channelId}'`});
    }
};