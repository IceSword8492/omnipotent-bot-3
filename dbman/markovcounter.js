import DBMan from "../utils/dbman.js"

export default class MarkovManager extends DBMan {
    static tablename = "markovCounter";
    static columns = {channelId: this.types.text, messageCount: this.types.integer, messageLimit: this.types.integer, permission: this.types.integer};

    static async create () {
        
    }
};